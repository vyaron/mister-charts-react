import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get directory of current file
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data', 'students.json')

// Helper to read/write JSON
function readData() {
  const content = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(content)
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// Create MCP server
const server = new McpServer({
  name: 'json-data-server',
  version: '1.0.0',
})

// TOOL 1: List all students
server.tool(
  'list_students',
  'Get all students from the database',
  {},
  async () => {
    const data = readData()
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data.students, null, 2),
        },
      ],
    }
  }
)

// TOOL 2: Get student by ID
server.tool(
  'get_student',
  'Get a specific student by their ID',
  {
    id: z.number().describe('The student ID'),
  },
  async ({ id }) => {
    const data = readData()
    const student = data.students.find((s) => s.id === id)

    if (!student) {
      return {
        content: [{ type: 'text', text: `Student with ID ${id} not found` }],
        isError: true,
      }
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(student, null, 2) }],
    }
  }
)

// TOOL 3: Search students by course
server.tool(
  'search_by_course',
  'Find all students enrolled in a specific course',
  {
    course: z.string().describe('The course name to search for'),
  },
  async ({ course }) => {
    const data = readData()
    const matched = data.students.filter(
      (s) => s.course.toLowerCase() === course.toLowerCase()
    )

    return {
      content: [
        {
          type: 'text',
          text:
            matched.length > 0
              ? JSON.stringify(matched, null, 2)
              : `No students found in course: ${course}`,
        },
      ],
    }
  }
)

// TOOL 4: Add a new student
server.tool(
  'add_student',
  'Add a new student to the database',
  {
    name: z.string().describe('Student name'),
    course: z.string().describe('Course name'),
    grade: z.number().min(0).max(100).describe('Grade (0-100)'),
  },
  async ({ name, course, grade }) => {
    const data = readData()

    const newId = Math.max(...data.students.map((s) => s.id), 0) + 1
    const newStudent = { id: newId, name, course, grade }

    data.students.push(newStudent)
    writeData(data)

    return {
      content: [
        {
          type: 'text',
          text: `Added student: ${JSON.stringify(newStudent, null, 2)}`,
        },
      ],
    }
  }
)

// TOOL 5: Get statistics
server.tool(
  'get_stats',
  'Get statistics about students (count, average grade, etc.)',
  {},
  async () => {
    const data = readData()
    const students = data.students

    const stats = {
      totalStudents: students.length,
      averageGrade: (
        students.reduce((sum, s) => sum + s.grade, 0) / students.length
      ).toFixed(1),
      courseBreakdown: students.reduce((acc, s) => {
        acc[s.course] = (acc[s.course] || 0) + 1
        return acc
      }, {}),
      topStudent: students.reduce((top, s) =>
        s.grade > (top?.grade || 0) ? s : top
      , null),
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }],
    }
  }
)

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('MCP JSON Server running on stdio')
}

main().catch(console.error)
