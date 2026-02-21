# Contributing to Driving School Management System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions with other contributors and maintainers.

## How to Contribute

### 1. Fork & Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/driving-school-mern.git
cd driving-school-mern
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b bugfix/issue-description
```

### 3. Make Your Changes

#### Backend Changes (server/)
- Add/modify routes in `server.js`
- Follow existing REST API patterns
- Test with MongoDB locally
- Add appropriate error handling

#### Frontend Changes (server/client/src/)
- Create new components in `components/` folder
- Add API functions to `services/api.js`
- Follow existing component patterns (props, hooks)
- Add responsive CSS to `App.css`

### 4. Testing

Before submitting:
- Test new features locally
- Verify existing features still work
- Test different user roles (Student, Instructor, Admin)
- Check responsive design on mobile view

### 5. Commit & Push

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add student progress tracking"
# or
git commit -m "fix: resolve pagination bug in attendance list"

# Push to your fork
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to GitHub and create a Pull Request
- Provide clear description of changes
- Reference any related issues
- Include screenshots for UI changes

## Coding Style

### Backend (Node.js/Express)
```javascript
// Use meaningful variable names
const studentRegistrations = await Registration.find();

// Add comments for complex logic
// Calculate total fees from all active registrations
const totalFees = registrations.reduce((sum, reg) => sum + reg.fees, 0);

// Use async/await for database operations
try {
  const result = await Model.findByIdAndUpdate(id, data);
  return result;
} catch (error) {
  console.error('Update failed:', error);
  throw error;
}
```

### Frontend (React/JavaScript)
```javascript
// Use functional components with hooks
function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects here
  }, [dependency]);
  
  return (
    <div className="my-component">
      {/* JSX here */}
    </div>
  );
}
```

### CSS
```css
/* Use semantic class names */
.registration-form {
  /* styles */
}

/* Use variables for colors */
.button-primary {
  background-color: #1e40af;
}

/* Mobile-first responsive design */
@media (max-width: 768px) {
  /* styles */
}
```

## Commit Message Format

Follow this format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code restructuring
- `test:` for adding tests
- `chore:` for maintenance

Example:
```
feat: add student attendance tracking dashboard

- Implemented new StudentDashboard component
- Added attendance statistics calculation
- Created responsive layout for mobile devices
```

## Feature Request Process

1. Check existing [Issues](../../issues) to avoid duplicates
2. Create new Issue with descriptive title
3. Include:
   - Current behavior
   - Expected behavior
   - Use case/reason
   - Screenshots if applicable

## Bug Report Process

1. Check existing [Issues](../../issues) for similar bugs
2. Create new Issue with title: "Bug: [description]"
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Browser/system info
   - Screenshots/error logs

## Review Process

- Maintainers will review your PR within 1-2 weeks
- Changes may be requested
- Once approved, your PR will be merged
- Your contribution will be credited

## Questions?

- Create a GitHub Discussion
- Open an Issue with question label
- Contact: your-email@example.com

Thank you for contributing! 🚀
