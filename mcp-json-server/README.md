# MCP JSON Server

A simple MCP (Model Context Protocol) server that exposes a JSON file as a data source.

## What is MCP?

MCP is a standardized protocol that allows AI assistants to connect to external tools and data sources. Think of it as "USB-C for AI" - one standard protocol that connects everything.

## Project Structure

```
mcp-json-server/
├── index.js          # MCP server implementation
├── data/
│   └── students.json # Sample data file
└── package.json
```

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_students` | Get all students | None |
| `get_student` | Get student by ID | `id: number` |
| `search_by_course` | Find students by course | `course: string` |
| `add_student` | Add a new student | `name, course, grade` |
| `get_stats` | Get statistics | None |

## How to Use

### 1. Test locally
```bash
npm start
```

### 2. Add to VS Code MCP settings

Open your MCP settings file and add:

```json
{
  "servers": {
    "json-data": {
      "command": "node",
      "args": ["C:/path/to/mcp-json-server/index.js"]
    }
  }
}
```

### 3. Reload VS Code and use!

Ask your AI assistant:
- "List all students"
- "Find students in the React course"
- "Add a student named Frank in Node.js with grade 87"
- "Get statistics about students"

## Key Concepts Demonstrated

1. **Server Creation** - Using `McpServer` from the SDK
2. **Tools** - Functions the AI can call with parameters
3. **Schema Validation** - Using Zod for parameter validation
4. **Stdio Transport** - Communication over stdin/stdout
5. **CRUD Operations** - Read and write to local files

## Extending This Example

- Add more data files (courses.json, teachers.json)
- Add update/delete operations
- Add filtering and sorting
- Connect to a real database instead of JSON
- Add authentication
