<script setup lang="ts">
// PDFlow Logo — 纯展示组件
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" fill="none">
    <!-- PDFlow Logo: stylized "P" document icon + "PDFlow" text -->
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2563EB"/>
        <stop offset="100%" stop-color="#3B82F6"/>
      </linearGradient>
    </defs>
    <!-- Document icon -->
    <rect x="4" y="3" width="18" height="22" rx="3" fill="url(#logoGrad)"/>
    <rect x="9" y="7" width="8" height="2" rx="1" fill="white" opacity="0.9"/>
    <rect x="9" y="11" width="10" height="2" rx="1" fill="white" opacity="0.7"/>
    <rect x="9" y="15" width="7" height="2" rx="1" fill="white" opacity="0.5"/>
    <rect x="9" y="19" width="9" height="2" rx="1" fill="white" opacity="0.4"/>
    <!-- "P" letter on document -->
    <text x="11.5" y="17" fill="white" font-size="10" font-weight="800" font-family="system-ui">P</text>
    <!-- Text -->
    <text x="30" y="22" fill="currentColor" font-size="16" font-weight="700" font-family="system-ui">
      PDFlow
    </text>
  </svg>
</template>