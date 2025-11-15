# Contributing Guidelines

Thank you for your interest in contributing to Awesome Frontend Resources! 🎉

## How to Contribute

### Adding a New Resource

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b feature/amazing-resource`)
3. **Add your resource** following the format below
4. **Commit your changes** (`git commit -m 'Add amazing resource'`)
5. **Push to the branch** (`git push origin feature/amazing-resource`)
6. **Open a Pull Request**

## Submission Format

Each resource should follow this format:

```markdown
- [Resource Name](URL) - A brief one-sentence description of what the resource is and why it's useful.
```

### Example

```markdown
- [React](https://react.dev/) - A JavaScript library for building user interfaces.
```

### JSON Format (for direct edits to `src/data/resources.json`)

If you're editing the JSON file directly, each resource should follow this structure:

```json
{
  "id": "resource-id",
  "title": "Resource Name",
  "url": "https://example.com",
  "description": "A brief one-sentence description of what the resource is and why it's useful.",
  "category": "Framework",
  "tags": ["tag1", "tag2"],
  "addedOn": "2024-01-01",
  "isFeatured": false
}
```

**Note:** The `isFeatured` field should be set to `false` for new resources. Only maintainers will set this to `true` for curated featured resources.

## Criteria for Inclusion

We only accept resources that meet the following criteria:

### ✅ What We Accept

- **Actively Maintained**: Resources should be actively maintained (updated within the last year)
- **Widely Recommended**: Resources should be well-known and recommended by the community
- **High Quality**: Resources should provide significant value to frontend developers
- **Free or Open Source**: Preference given to free or open-source resources
- **Relevant**: Resources must be directly related to frontend development

### ❌ What We Don't Accept

- Resources that are no longer maintained
- Duplicate resources (check if it's already listed)
- Resources with broken links
- Resources that are not directly related to frontend development
- Paid courses or services (unless they offer significant free value)
- Personal blogs or portfolios (unless they provide exceptional educational content)

## Categories

Please add resources to the most appropriate category. If you're unsure, add it to "Other Resources" and we'll help categorize it.

### Category Guidelines

- **Start Broad**: Fundamental web technologies (HTML, CSS, JavaScript)
- **Core Concepts**: Essential frontend concepts (Accessibility, Performance, Security, PWA)
- **Frameworks & Libraries**: Popular frameworks and their ecosystems
- **Tooling**: Development tools, build systems, testing frameworks
- **Beyond the Code**: Design, animation, learning resources, APIs

## Pull Request Process

1. **Keep it focused**: One resource per PR is preferred (unless adding multiple related resources)
2. **Check spelling and grammar**: Use proper capitalization and punctuation
3. **Test your links**: Ensure all URLs are working
4. **Follow the format**: Use the exact format specified above
5. **Add to the right section**: Place your resource in the most appropriate category

## Review Process

- All PRs will be reviewed within 48 hours
- We may suggest changes or ask for clarification
- Once approved, your PR will be merged
- Contributors will be credited in the repository

## Questions?

If you have questions about contributing, please:

- Open an issue for discussion
- Check existing issues for similar questions
- Review the README for category descriptions

## Code of Conduct

Please note that this project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

Thank you for helping make this resource list awesome! 🚀
