# Nginx VM Implementation Guide for Nuxt.js in Docker

## Overview

This guide provides instructions for implementing an optimized Nginx configuration on your VM to properly forward traffic to your Nuxt.js application running in Docker Compose.

## Current Setup

Based on the analysis of your project:

- You have a Nuxt.js application running in Docker using `npm run start` command
- The Docker container exposes port 6032 (mapped to internal port 3000)
- Nginx is installed on the VM (not in the container)
- Nginx needs to forward traffic to the Nuxt.js application

## Implementation Steps

### 1. Update VM's Nginx Configuration

Copy the provided `nginx-vm.conf` file to your VM's Nginx configuration directory:

```bash
# On your VM
sudo cp /path/to/nginx-vm.conf /etc/nginx/sites-available/rms-ui.conf
sudo ln -s /etc/nginx/sites-available/rms-ui.conf /etc/nginx/sites-enabled/
```

### 2. Create Nginx Cache Directory

```bash
# On your VM
sudo mkdir -p /var/cache/nginx/proxy_cache
sudo chmod -R 755 /var/cache/nginx/proxy_cache
sudo chown -R www-data:www-data /var/cache/nginx/proxy_cache  # Use appropriate Nginx user
```

### 3. Test Nginx Configuration

```bash
# On your VM
sudo nginx -t
```

### 4. Restart Nginx

```bash
# On your VM
sudo systemctl restart nginx
```

## Configuration Highlights

The provided `nginx-vm.conf` includes the following optimizations:

1. **Proxy Caching**: Caches static assets for improved performance
2. **WebSocket Support**: Properly handles WebSocket connections with appropriate timeouts
3. **Gzip Compression**: Reduces bandwidth usage and improves load times
4. **Browser Cache Control**: Optimizes client-side caching
5. **SSL Configuration**: Maintains your existing SSL setup
6. **Specific Nuxt.js Optimizations**:
   - Special handling for `/_nuxt/` directory (Nuxt.js assets)
   - Different caching strategies for API vs static content
   - Increased timeouts for Nuxt SSR

## Verifying the Configuration

After deployment, verify that the configuration is working correctly:

1. **Check Nginx logs for errors**:

```bash
sudo tail -f /var/log/nginx/error.log
```

2. **Verify caching is working** by examining response headers:

```bash
curl -I https://rms.myradar.com.bd/_nuxt/some-asset.js
```

Look for headers like `X-Cache-Status`, `Cache-Control`, and `Expires`.

3. **Test WebSocket connections** by monitoring network traffic in your browser's developer tools.

## Troubleshooting

- **Issue**: Nginx fails to start

  - **Solution**: Check logs with `sudo journalctl -u nginx` and verify configuration with `sudo nginx -t`

- **Issue**: WebSockets disconnecting

  - **Solution**: Increase the `proxy_read_timeout` and `proxy_send_timeout` values in the WebSocket location block

- **Issue**: Static assets not being cached
  - **Solution**: Verify cache directory permissions and check that the cache configuration is loaded

## Performance Monitoring

Monitor the performance improvements using tools like:

- Google PageSpeed Insights
- Browser Developer Tools (Network tab)
- `htop` or `top` to monitor server resource usage

We should see reduced load times, decreased bandwidth usage, and improved overall performance.
