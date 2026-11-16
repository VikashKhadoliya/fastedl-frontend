/**
 * Real-Time Stream Download Manager for FastEDL
 * Streams media progressive chunks via Fetch API ReadableStream,
 * computing true bytes received, Content-Length percentage, smoothed transfer speed,
 * and accurate remaining time without any simulated or random numbers.
 */

export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1);
  return `${val} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec) {
  if (!bytesPerSec || bytesPerSec <= 0) return "-- KB/s";
  if (bytesPerSec < 1024) return `${Math.round(bytesPerSec)} B/s`;
  if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
}

export function formatETA(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) return "--";
  if (seconds < 1) return "< 1s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

/**
 * Downloads a media file with real-time stream tracking.
 *
 * @param {Object} options
 * @param {string} options.url - The backend proxy stream URL
 * @param {string} options.filename - Safe target filename
 * @param {string} [options.qualityLabel] - Optional quality label (e.g. "1080p Full HD")
 * @param {AbortSignal} [options.signal] - Optional AbortSignal for user cancellation
 * @param {function} [options.onStateChange] - Callback for state changes ('idle' | 'preparing' | 'downloading' | 'completed' | 'failed')
 * @param {function} [options.onProgress] - Callback for live streaming metrics
 * @returns {Promise<{ filename: string, totalBytes: number }>}
 */
export async function downloadMediaWithProgress({
  url,
  filename,
  qualityLabel,
  signal,
  onStateChange,
  onProgress
}) {
  onStateChange?.("preparing");

  onProgress?.({
    receivedBytes: 0,
    totalBytes: 0,
    percent: 0,
    speed: 0,
    remainingSeconds: null,
    indeterminate: true,
    qualityLabel: qualityLabel || "Original",
    filename
  });

  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      signal,
      headers: {
        Accept: "*/*",
      },
    });
  } catch (err) {
    if (signal?.aborted) {
      onStateChange?.("idle");
      throw new Error("Download cancelled by user.");
    }
    const errMessage = err.message?.includes("fetch") || err.message?.includes("network")
      ? "Network connection interrupted while reaching download server. Please retry."
      : err.message || "Failed to initiate media download.";
    onStateChange?.("failed", errMessage);
    throw new Error(errMessage);
  }

  if (!response.ok) {
    let errMessage = "Download failed. The media link may have expired.";
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMessage = typeof errData.detail === "string" ? errData.detail : (errData.detail[0]?.msg || errMessage);
      }
    } catch (_) {
      errMessage = `Server returned status ${response.status}. Please try again.`;
    }
    onStateChange?.("failed", errMessage);
    throw new Error(errMessage);
  }

  // Inspect headers for true file length and content type
  const contentLengthHdr = response.headers.get("content-length");
  const totalBytes = contentLengthHdr ? parseInt(contentLengthHdr, 10) : 0;
  const contentType = response.headers.get("content-type") || (
    filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")
      ? "image/jpeg"
      : "video/mp4"
  );

  // If ReadableStream is not available (rare fallback)
  if (!response.body || !response.body.getReader) {
    try {
      onStateChange?.("downloading");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 15000);

      onStateChange?.("completed");
      return { filename, totalBytes: blob.size };
    } catch (fallbackErr) {
      onStateChange?.("failed", fallbackErr.message);
      throw fallbackErr;
    }
  }

  // Active progressive streaming
  onStateChange?.("downloading");

  const reader = response.body.getReader();
  const chunks = [];
  let receivedBytes = 0;

  const startTime = performance.now();
  let lastSpeedTime = startTime;
  let lastSpeedBytes = 0;
  let smoothedSpeed = 0;
  const speedSmoothingAlpha = 0.65; // exponential moving average weight for stable real-time speed

  try {
    while (true) {
      if (signal?.aborted) {
        await reader.cancel("User cancelled download").catch(() => {});
        onStateChange?.("idle");
        throw new Error("Download cancelled by user.");
      }

      const { done, value } = await reader.read();
      if (done) break;

      if (value && value.length > 0) {
        chunks.push(value);
        receivedBytes += value.length;

        const now = performance.now();
        const deltaSeconds = (now - lastSpeedTime) / 1000;

        // Sample speed at 200ms intervals to eliminate instantaneous jitter
        if (deltaSeconds >= 0.2) {
          const deltaBytes = receivedBytes - lastSpeedBytes;
          const instantSpeed = deltaBytes / deltaSeconds;

          smoothedSpeed = smoothedSpeed === 0
            ? instantSpeed
            : smoothedSpeed * (1 - speedSmoothingAlpha) + instantSpeed * speedSmoothingAlpha;

          lastSpeedTime = now;
          lastSpeedBytes = receivedBytes;
        }

        // Percentage and remaining time
        let percent = 0;
        let remainingSeconds = null;

        if (totalBytes > 0) {
          percent = Math.min(99, Math.round((receivedBytes / totalBytes) * 100));
          const remainingBytes = Math.max(0, totalBytes - receivedBytes);
          if (smoothedSpeed > 0) {
            remainingSeconds = Math.max(0, Math.round(remainingBytes / smoothedSpeed));
          }
        }

        onProgress?.({
          receivedBytes,
          totalBytes,
          percent,
          speed: smoothedSpeed,
          remainingSeconds,
          indeterminate: totalBytes <= 0,
          qualityLabel: qualityLabel || "Original",
          filename
        });
      }
    }

    // 100% completion marker
    onProgress?.({
      receivedBytes,
      totalBytes: totalBytes > 0 ? totalBytes : receivedBytes,
      percent: 100,
      speed: smoothedSpeed,
      remainingSeconds: 0,
      indeterminate: false,
      qualityLabel: qualityLabel || "Original",
      filename
    });

    // Assemble final Blob and trigger browser download
    const blob = new Blob(chunks, { type: contentType });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Auto cleanup of blob object URL after browser starts saving
    setTimeout(() => {
      try {
        window.URL.revokeObjectURL(blobUrl);
      } catch (_) {}
    }, 20000);

    onStateChange?.("completed");
    return { filename, totalBytes: receivedBytes };

  } catch (err) {
    // Release reader lock and cleanup memory
    try {
      await reader.cancel().catch(() => {});
    } catch (_) {}
    chunks.length = 0;

    if (signal?.aborted) {
      onStateChange?.("idle");
      throw new Error("Download cancelled by user.");
    }

    const errMessage = err.message || "An unexpected error occurred while streaming media.";
    onStateChange?.("failed", errMessage);
    throw err;
  }
}
