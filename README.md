# Customizable Dashboard Plugin for Super Productivity

A modern, TypeScript-based plugin for Super Productivity that provides a customizable dashboard using Solid.js.

## Features

- 🚀 **Solid.js** - Fast, reactive UI framework
- 📘 **TypeScript** - Full type safety with Super Productivity Plugin API
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- 🔧 **Vite** - Lightning-fast development and build tooling
- 📦 **Ready to Use** - Complete setup with examples for all plugin features

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Super Productivity 8.0.0+

### Installation

1. Clone this repository:

```bash
git clone https://github.com/DanyMint/sp-customizable-dashboard.git
cd sp-customizable-dashboard
```

2. Run the dependencies setup script:

```bash
npm run sp-deps:install
```

This script will:
- Clone the Super Productivity core repository to a local cache
- Build the required plugin API and Vite plugin
- Copy these dependencies to the `sp-deps/` directory
- Install all project dependencies

3. Update plugin metadata in `src/manifest.json` if needed.

### Development

Run the development server:

```bash
npm run dev
```

This starts Vite in watch mode. Your plugin will rebuild automatically when you make changes.

### Building

Build the plugin for production:

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### Packaging

Create a ZIP file for distribution:

```bash
npm run package
```

This will:

1. Build the plugin
2. Create a ZIP file containing all necessary files (e.g., `sp-customizable-dashboard-v0.0.1.zip`)
3. Place the ZIP in the root directory

## Project Structure

```
src/
├── assets/          # Static assets (icons, images)
│   └── icon.svg     # Plugin icon
├── app/             # Solid.js application
│   ├── App.tsx      # Main app component
│   └── App.css      # App styles
├── utils/           # Helper utilities
│   └── useTranslate.ts  # i18n hook for translations
├── index.html       # Plugin UI entry point
├── index.tsx        # UI initialization
├── plugin.ts        # Plugin logic and API integration
└── manifest.json    # Plugin metadata

i18n/                # Translation files (optional)
├── en.json          # English translations (required)
├── de.json          # German translations (example)
└── ru.json          # Russian translations

sp-deps/            # Local copies of Super Productivity plugin dependencies
├── plugin-api/     # @super-productivity/plugin-api
└── vite-plugin/    # @super-productivity/vite-plugin

scripts/            # Build and utility scripts
├── build-plugin.js  # Plugin packaging script
└── sp-core.js       # Dependency sync and setup script

dist/               # Build output (gitignored)
```

## Internationalization (i18n)

This boilerplate includes built-in support for multi-language plugins.

### Translation Files

Translation files are located in the `i18n/` directory and use JSON format with nested keys:

```json
{
  "APP": {
    "TITLE": "My Plugin",
    "SUBTITLE": "Description"
  },
  "BUTTONS": {
    "SAVE": "Save",
    "CANCEL": "Cancel"
  },
  "MESSAGES": {
    "SUCCESS": "Task \"{{title}}\" created!"
  }
}
```

**Note**: English (`en.json`) is required and used as a fallback when translations are missing.

### Using Translations in Components

Use the `useTranslate()` hook in your Solid.js components:

```typescript
import { useTranslate } from '../utils/useTranslate';

function MyComponent() {
  const t = useTranslate();
  const [title, setTitle] = createSignal('');

  // Load translation
  createEffect(async () => {
    setTitle(await t('APP.TITLE'));
  });

  return <h1>{title()}</h1>;
}
```

**With parameters** (for interpolation):

```typescript
createEffect(async () => {
  const message = await t('MESSAGES.SUCCESS', { title: 'My Task' });
  // Returns: 'Task "My Task" created!'
  setMessage(message);
});
```

### Adding New Languages

1. Add the language code to `manifest.json`:

```json
{
  "i18n": {
    "languages": ["en", "de", "fr"]
  }
}
```

2. Create the translation file (e.g., `i18n/fr.json`):

```json
{
  "APP": {
    "TITLE": "Mon Plugin"
  }
}
```

3. Rebuild the plugin: `npm run build`

### Translation Key Format

- Use hierarchical keys: `APP.TITLE`, `SETTINGS.THEME`
- Use parameter interpolation: `"message": "Hello {{name}}"`
- Keep keys descriptive and consistent
- English is the fallback language

For complete i18n documentation, see [Plugin i18n Guide](../PLUGIN_I18N.md).

## Plugin API Usage

### Basic Setup

The plugin API is exposed through the global `plugin` object in `plugin.ts`:

```typescript
import { PluginInterface } from '@super-productivity/plugin-api';

declare const plugin: PluginInterface;
```

### Common API Methods

#### UI Registration

```typescript
// Register header button
plugin.registerHeaderButton({
  icon: 'rocket',
  tooltip: 'Open Plugin',
  action: () => plugin.showIndexHtmlAsView(),
});

// Register menu entry
plugin.registerMenuEntry({
  label: 'My Plugin',
  icon: 'rocket',
  action: () => plugin.showIndexHtmlAsView(),
});

// Register keyboard shortcut
plugin.registerShortcut({
  keys: 'ctrl+shift+m',
  label: 'Open My Plugin',
  action: () => plugin.showIndexHtmlAsView(),
});
```

#### Data Operations

```typescript
// Get tasks
const tasks = await plugin.getTasks();
const archivedTasks = await plugin.getArchivedTasks();

// Create task
const newTask = await plugin.addTask({
  title: 'New Task',
  projectId: 'project-id',
});

// Update task
await plugin.updateTask('task-id', {
  title: 'Updated Title',
  isDone: true,
});

// Get projects and tags
const projects = await plugin.getAllProjects();
const tags = await plugin.getAllTags();
```

#### Event Hooks

```typescript
// Task completion
plugin.on('taskComplete', (task) => {
  console.log('Task completed:', task.title);
});

// Task updates
plugin.on('taskUpdate', (task) => {
  console.log('Task updated:', task);
});

// Context changes
plugin.on('contextChange', (context) => {
  console.log('Context changed:', context);
});
```

#### Communication with UI

In `plugin.ts`:

```typescript
plugin.onMessage('myCommand', async (data) => {
  // Handle message from UI
  return { result: 'success' };
});
```

In your Solid.js component:

```typescript
const sendMessage = async (type: string, payload?: any) => {
  return new Promise((resolve) => {
    const messageId = Math.random().toString(36).substr(2, 9);

    const handler = (event: MessageEvent) => {
      if (event.data.messageId === messageId) {
        window.removeEventListener('message', handler);
        resolve(event.data.response);
      }
    };

    window.addEventListener('message', handler);
    window.parent.postMessage({ type, payload, messageId }, '*');
  });
};

// Usage
const result = await sendMessage('myCommand', { foo: 'bar' });
```

## Customization

### Styling

The boilerplate includes:

- CSS custom properties for theming
- Dark mode support
- Responsive design
- Minimal, clean styling

Modify `src/app/App.css` to customize the appearance.

### Adding Features

1. **New UI Components**: Add them in `src/app/` as `.tsx` files
2. **New API Endpoints**: Add handlers in `src/plugin.ts` using `plugin.onMessage()`
3. **New Hooks**: Register them in `manifest.json` and handle in `plugin.ts`
4. **Permissions**: Add required permissions to `manifest.json`

## Best Practices

1. **Type Safety**: Always use TypeScript types from `@super-productivity/plugin-api`
2. **Error Handling**: Wrap async operations in try-catch blocks
3. **Performance**: Use Solid.js signals and effects efficiently
4. **Security**: Never expose sensitive data or operations
5. **User Experience**: Provide loading states and error feedback

## Deployment

1. Build the plugin: `npm run build`
2. Package it: `npm run package`
3. Upload the ZIP file to Super Productivity:
   - Open Super Productivity
   - Go to Settings → Plugins
   - Click "Upload Plugin"
   - Select your ZIP file

## Troubleshooting

### Plugin not loading

- Check browser console for errors
- Verify `manifest.json` is valid JSON
- Ensure `minSupVersion` matches your Super Productivity version

### API calls failing

- Check if you have required permissions in `manifest.json`
- Verify Super Productivity is running the correct version
- Look for error messages in the console

### Build errors

- Run `npm run typecheck` to check for TypeScript errors
- Ensure all dependencies are installed
- Clear `node_modules` and reinstall if needed

## Resources

- [Super Productivity Plugin API Documentation](https://github.com/super-productivity/super-productivity)
- [Solid.js Documentation](https://www.solidjs.com/docs/latest)
- [Vite Documentation](https://vitejs.dev/)

## License

This boilerplate is provided as-is for creating Super Productivity plugins. Feel free to modify and distribute your plugins as you see fit.
