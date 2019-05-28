# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## [0.4.0] - 2019-05-28
### Add
- Add `Container`
- Add application configuration to `@App` decorator
- Add bin utility

### Change
- Modularized Hans (with adapters!)
- Refactor getting/setting metadata (`Metadata` helper class)

## [0.3.0] - 2019-04-09
### Add
- Add `TemplateResponse`
- Add `FileResponse`
- Add `TemplateResponse`
- Add local and global state capabilities
- Add middleware
- Add random generator for weighted elements
- Add faker library and proper examples
- Add simplified import paths
- Add body parser middleware by default
- Add linting for Hans

### Change
- Refactor (aka improve) code
- Move examples to examples directory
- Move metadata keys to separate enum

### Fix
- Automatically add missing slashes for routes
