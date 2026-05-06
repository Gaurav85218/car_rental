# Cloudinary Setup Guide

This guide explains how to set up and configure Cloudinary for the Car Rental Platform.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management platform that provides:
- Image upload and storage
- Automatic optimization and resizing
- CDN delivery for fast loading
- URL-based image manipulation
- Secure API access

## Getting Started

### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click "Sign Up Free"
3. Create an account with your email
4. Verify your email
5. Complete the setup wizard

### Step 2: Get Your Credentials

1. Go to your Cloudinary Dashboard
2. Look for the "Account Details" section
3. You'll find:
   - **Cloud Name**: Your unique identifier
   - **API Key**: Public API key
   - **API Secret**: Private API secret (keep this secret!)

### Step 3: Configure in Application

#### Option A: Using application.properties (Development)

Edit `backend/src/main/resources/application.properties`:

```properties
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
```

#### Option B: Using Environment Variables (Recommended for Production)

```bash
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret
```

Then update `application.properties`:

```properties
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}
```

## Configuration Details

### Current Setup

The application is configured with:

```
Cloud Name: dg3cuao22
API Key: 946122347991716
API Secret: phzFwknycQTC5nNzjNrkFIc
```

**⚠️ IMPORTANT**: These are example credentials. Replace them with your own for production!

### Upload Settings

The application uploads images with these settings:

```java
Map uploadResult = cloudinary.uploader().upload(
    file.getBytes(),
    ObjectUtils.asMap(
        "resource_type", "auto",
        "folder", "car-rental",
        "quality", "auto",
        "fetch_format", "auto"
    )
);
```

**Settings Explanation**:
- `resource_type: auto` - Automatically detect file type
- `folder: car-rental` - Organize images in a folder
- `quality: auto` - Optimize image quality
- `fetch_format: auto` - Serve optimal format (WebP, JPEG, etc.)

## Image Management

### Upload Limits

- **Maximum images per car**: 4
- **Maximum file size**: 100MB (Cloudinary default)
- **Supported formats**: JPG, PNG, GIF, WebP, etc.

### Image Optimization

Cloudinary automatically:
- Resizes images to optimal dimensions
- Compresses for faster loading
- Converts to optimal format for each browser
- Serves from CDN for fast delivery

### Accessing Images

Images are stored as URLs in the database:

```
https://res.cloudinary.com/dg3cuao22/image/upload/car-rental/...
```

These URLs can be used directly in `<img>` tags.

## Security Best Practices

### 1. Protect Your API Secret

**Never expose your API secret in:**
- Frontend code
- Public repositories
- Client-side JavaScript
- Version control

### 2. Use Environment Variables

```bash
# .env file (not committed to git)
CLOUDINARY_API_SECRET=your_secret_key
```

### 3. Restrict API Key Permissions

In Cloudinary Dashboard:
1. Go to Settings → Security
2. Set API Key restrictions
3. Limit to specific operations (upload, delete, etc.)

### 4. Use Signed URLs

For sensitive operations, use signed URLs:

```java
Map params = ObjectUtils.asMap(
    "timestamp", System.currentTimeMillis() / 1000,
    "public_id", publicId
);
String signature = cloudinary.apiSignRequest(params, cloudinary.config().apiSecret);
```

## Troubleshooting

### Issue: "Invalid API Key"

**Solution**:
- Verify API key is correct
- Check for extra spaces or characters
- Regenerate API key in Cloudinary Dashboard

### Issue: "Upload Failed"

**Solution**:
- Check file size (max 100MB)
- Verify file format is supported
- Check internet connection
- Review Cloudinary usage limits

### Issue: "Images Not Displaying"

**Solution**:
- Verify image URLs are correct
- Check CORS settings in Cloudinary
- Ensure images are public (not private)
- Check browser console for errors

### Issue: "Folder Not Created"

**Solution**:
- Cloudinary creates folders automatically
- Check folder name in upload settings
- Verify folder permissions

## Advanced Features

### Image Transformations

You can manipulate images using URL parameters:

```
// Resize to 300x300
https://res.cloudinary.com/dg3cuao22/image/upload/w_300,h_300/...

// Add quality optimization
https://res.cloudinary.com/dg3cuao22/image/upload/q_auto/...

// Convert to WebP
https://res.cloudinary.com/dg3cuao22/image/upload/f_webp/...
```

### Responsive Images

Use Cloudinary's responsive image features:

```html
<img 
  src="https://res.cloudinary.com/dg3cuao22/image/upload/w_auto,c_scale/..."
  alt="Car"
/>
```

### Video Support

Cloudinary also supports video uploads:

```java
cloudinary.uploader().upload(
    file.getBytes(),
    ObjectUtils.asMap("resource_type", "video")
);
```

## Monitoring & Analytics

### Check Usage

1. Go to Cloudinary Dashboard
2. Click "Usage" tab
3. View:
   - Storage used
   - Bandwidth used
   - API calls made
   - Transformations performed

### Set Alerts

1. Go to Settings → Notifications
2. Set up email alerts for:
   - Storage limits
   - Bandwidth limits
   - API rate limits

## Pricing

### Free Plan
- 25 GB storage
- 25 GB bandwidth/month
- Unlimited API calls
- Basic transformations

### Paid Plans
- Additional storage and bandwidth
- Advanced features
- Priority support
- Custom domain

See [Cloudinary Pricing](https://cloudinary.com/pricing) for details.

## Migration from Another Service

If migrating from another image service:

1. Export existing images
2. Create migration script
3. Upload to Cloudinary
4. Update database URLs
5. Test all images
6. Delete old images

## Backup & Recovery

### Backup Images

```bash
# Export all images from Cloudinary
# Use Cloudinary API or dashboard export feature
```

### Recovery

```bash
# Re-upload images if needed
# Cloudinary keeps version history
```

## Support

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **API Reference**: https://cloudinary.com/documentation/image_upload_api_reference
- **Support**: https://support.cloudinary.com

## Next Steps

1. Create your Cloudinary account
2. Get your credentials
3. Update application configuration
4. Test image upload
5. Deploy to production

---

**Last Updated**: May 2026
