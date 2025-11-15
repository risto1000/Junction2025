# Tests

This directory contains all test files for the project.

## Structure

- `backend/` - Backend API and database tests
- `frontend/` - Frontend integration tests

## Running Tests

### Backend Tests

```bash
# Test database initialization
cd backend
npm run test:db

# Test voice profile endpoint
npm run test:voice-profile

# Run full automation flow test
../tests/test-full-flow.sh
```

### Frontend Tests

Open `frontend/test-api.html` in a browser to test the API integration interactively.

