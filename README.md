# dxe.io url shortcuts

This app powers dxe.io, DxE's internal url shortcuts.

This app uses the MEAN stack. For more info, see README.mean.md.

# Deploy

First, make sure you have permission to write to dokku.

```
# First, add dokku as a remote repository
git remote add dokku dokku@dxetech.org:shortcuts
# Push the lastest commit to dokku and it will automatically deploy.
git push dokku master
```
