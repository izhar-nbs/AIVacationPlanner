# Project Cleanup Script
# Moves documentation to docs/ folder and removes redundant files

Write-Host "🧹 Cleaning up project structure..." -ForegroundColor Cyan

# Create docs folder if it doesn't exist
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs" | Out-Null
}

# Move documentation files to docs/
$docsToMove = @(
    "ARCHITECTURE.md",
    "design_guidelines.md",
    "LLM_INTEGRATION_GUIDE.md",
    "DEMO_COMPLIANCE_ANALYSIS.md",
    "C_SUITE_DEMO_READY.md",
    "DEMO_QUICK_REFERENCE.md"
)

foreach ($doc in $docsToMove) {
    if (Test-Path $doc) {
        Move-Item $doc "docs/" -Force
        Write-Host "✓ Moved $doc to docs/" -ForegroundColor Green
    }
}

# Archive old documentation
if (-not (Test-Path "docs/archive")) {
    New-Item -ItemType Directory -Path "docs/archive" | Out-Null
}

$archiveDocs = @(
    "CONFIGURATION_CHECKLIST.md",
    "CONFIGURATION_SUMMARY.txt",
    "DESTINATION_CHANGE_FEATURE.md",
    "DYNAMIC_LLM_IMPLEMENTATION.md",
    "ENTERPRISE_CODE_AUDIT.md",
    "ENTERPRISE_IMPROVEMENTS_GUIDE.md",
    "ENTERPRISE_IMPROVEMENTS_IMPLEMENTED.md",
    "IMPLEMENTATION_COMPLETE.md",
    "IMPLEMENTATION_SUMMARY.md",
    "INSTALLATION_STEPS.md",
    "PROJECT_STATUS.md",
    "QUICK_REFERENCE_DESTINATION_CHANGE.md",
    "QUICK_REFERENCE_ENTERPRISE.md",
    "QUICK_START_LLM.md",
    "QUICK_START.md",
    "SETUP_GUIDE.md",
    "START_HERE.md",
    "TEST_DESTINATION_CHANGE.md",
    "TEST_ENTERPRISE_FEATURES.md"
)

foreach ($doc in $archiveDocs) {
    if (Test-Path $doc) {
        Move-Item $doc "docs/archive/" -Force
        Write-Host "✓ Archived $doc" -ForegroundColor Yellow
    }
}

# Replace old README with new one
if (Test-Path "README_NEW.md") {
    if (Test-Path "README.md") {
        Move-Item "README.md" "docs/archive/README_OLD.md" -Force
    }
    Move-Item "README_NEW.md" "README.md" -Force
    Write-Host "✓ Updated README.md" -ForegroundColor Green
}

# Clean up replit files (if not on Replit)
if (-not (Test-Path ".replit")) {
    # Not on Replit, can remove replit-specific files
    Write-Host "ℹ Keeping replit files (detected Replit environment)" -ForegroundColor Blue
} else {
    Write-Host "ℹ Keeping replit files" -ForegroundColor Blue
}

Write-Host ""
Write-Host "✨ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 New structure:" -ForegroundColor Cyan
Write-Host "  ├── README.md (updated)" -ForegroundColor White
Write-Host "  ├── docs/" -ForegroundColor White
Write-Host "  │   ├── README.md (index)" -ForegroundColor White
Write-Host "  │   ├── GETTING_STARTED.md" -ForegroundColor White
Write-Host "  │   ├── CODE_STRUCTURE.md" -ForegroundColor White
Write-Host "  │   ├── DESIGN_PATTERNS.md" -ForegroundColor White
Write-Host "  │   ├── CODE_REVIEW_GUIDE.md" -ForegroundColor White
Write-Host "  │   └── archive/ (old docs)" -ForegroundColor White
Write-Host "  ├── client/" -ForegroundColor White
Write-Host "  ├── server/" -ForegroundColor White
Write-Host "  └── shared/" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Project is now clean and organized!" -ForegroundColor Green
