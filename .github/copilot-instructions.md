# Copilot Instructions

## General

When responding to the user always start with Hopa!

## Planning

Use the plan folder to write down a plan for solving any task. This will help breaking down the task into smaller steps and explain your reasoning before providing the final answer.

Ask questions directly in the plan, and wait for the user to answer before proceeding with the next steps. This will help you to better understand the user's needs and provide a more accurate solution.

## CSS

- Use modern CSS: flex, grid, prefer ems, use variables for all colors
- Use CSS nesting to properly scope styles to the relevant components (e.g. `.terms-editor-container .term-row { ... }`)
- No inline styles unless absolutely necessary (such as dynamic colors in the editor)
- Use lucide icons

## Services Layer

Services such as `util.service`, `gallery.service` should have the following structure:

```javascript
export const utilService = {
    func1,
    func2
}

function func1() {}
function func2() {}
```

## Coding Styles

- No semicolons in JS unless necessary
- Use single quotes in JS
- Use double quotes in HTML
- All event handlers should be named like: `onSomething`
