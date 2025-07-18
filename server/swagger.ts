import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BarberPro Management System API',
      version: '1.0.0',
      description: `
# BarberPro Management System API

Comprehensive barbershop management system with role-based access control and multi-business SaaS management.

## Authentication Method

This API uses JWT Bearer authentication for all endpoints:

1. **Get JWT tokens**: Use \`/api/auth/login\` with valid credentials
2. **Use Bearer token**: Add \`Authorization: Bearer <access_token>\` header to requests
3. **Refresh tokens**: Use \`/api/auth/refresh\` before token expires (24h lifetime)
4. **Check user info**: Use \`/api/auth/me\` to get current user details

## Available Test Accounts

- **Super Admin**: \`mvnpereira@gmail.com\` / \`Marcos$1986\`
- **Test Account**: \`test@swagger.com\` / \`swagger123\` (for testing only)

## Role-Based Access

- **Super Admin (Role 1)**: Full access to all businesses and data
- **Merchant (Role 2)**: Access to their own business data
- **Employee (Role 3)**: Limited access to business operations
- **Client (Role 4)**: Personal appointments and profile access

## Testing JWT Authentication in Swagger

1. Use \`/api/auth/login\` to get an access token
2. Click the "Authorize" button (🔒) at the top
3. Enter \`Bearer <your_access_token>\` in the bearerAuth field
4. Test JWT-protected endpoints under "JWT Authentication" tag
      `,
      contact: {
        name: 'BarberPro Support',
        email: 'support@barberpro.com'
      }
    },
    servers: [
      {
        url: 'https://9d5dc195-9aec-4464-a135-6e1134bfee48-00-3a9ys8x8hly4z.riker.replit.dev',
        description: 'Production Server (Replit)'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      },
      {
        url: '',
        description: 'Current Domain'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token authentication. Login to get your token, then use it in the Authorization header.'
        },

      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            type: { type: 'string', example: 'super-admin' },
            description: { type: 'string', example: 'Super Administrator with full system access' }
          }
        },
        Business: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Elite Barbershop' },
            description: { type: 'string', example: 'Premium barbershop services' },
            address: { type: 'string', example: '123 Main St, City' },
            phone: { type: 'string', example: '+1-555-0123' },
            email: { type: 'string', format: 'email', example: 'contact@elitebarbershop.com' },
            tax_id: { type: 'string', example: '12345678901' },
            user_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Person: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            phone: { type: 'string', example: '+1-555-0123' },
            tax_id: { type: 'string', example: '12345678901' },
            address: { type: 'string', example: '123 Main St, City' },
            hire_date: { type: 'string', format: 'date', nullable: true },
            salary: { type: 'number', format: 'decimal', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true },
            user_id: { type: 'integer', nullable: true },
            email: { type: 'string', format: 'email', nullable: true }
          }
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Premium Haircut' },
            description: { type: 'string', example: 'Professional haircut with styling' },
            duration: { type: 'integer', example: 60 },
            price: { type: 'number', format: 'decimal', example: 35.00 },
            business_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            appointment_date: { type: 'string', format: 'date', example: '2025-06-17' },
            appointment_time: { type: 'string', format: 'time', example: '14:30:00' },
            status: { type: 'string', enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'], example: 'Scheduled' },
            notes: { type: 'string', example: 'Client prefers shorter sides' },
            user_id: { type: 'integer', example: 1 },
            client_id: { type: 'integer', example: 2 },
            business_id: { type: 'integer', example: 1 },
            service_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        AccountingTransaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            description: { type: 'string', example: 'Haircut service payment' },
            amount: { type: 'number', format: 'decimal', example: 35.00 },
            transaction_type: { type: 'string', enum: ['revenue', 'expense'], example: 'revenue' },
            transaction_date: { type: 'string', format: 'date', example: '2025-06-17' },
            category_id: { type: 'integer', example: 1 },
            business_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        WhatsappInstance: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            instance_name: { type: 'string', example: 'Main Business WhatsApp' },
            phone_number: { type: 'string', example: '+5511999887766' },
            api_url: { type: 'string', example: 'https://api.whatsapp.com/instance/123' },
            api_token: { type: 'string', example: 'wa_token_abc123' },
            status: { type: 'string', enum: ['Connected', 'Disconnected', 'Error'], example: 'Connected' },
            business_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            deleted_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Resource not found' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'array', items: { type: 'string' } },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./server/routes.ts', './server/index.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  const swaggerOptions = {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info hgroup.main h2 { color: #8B4513 }
      .swagger-ui .scheme-container { background: #f8f9fa }
      .swagger-ui .info .description .markdown p {
        background: #fff3cd;
        padding: 10px;
        border-left: 4px solid #8B4513;
        margin: 10px 0;
      }
    `,
    customSiteTitle: 'BarberPro API Documentation',
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelExpandDepth: 2,
      defaultModelsExpandDepth: 2,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      onComplete: () => {
        // This will be executed when Swagger UI is fully loaded
        console.log('Swagger UI loaded');
      }
    },
    customJsStr: `
      // Override the request interceptor to include credentials
      window.swaggerUIConfig = {
        requestInterceptor: function(request) {
          request.credentials = 'include';
          request.headers = request.headers || {};
          return request;
        }
      };
      
      // Wait for SwaggerUI to be ready
      window.addEventListener('DOMContentLoaded', function() {
        if (window.ui) {
          const originalFetch = window.fetch;
          window.fetch = function(...args) {
            if (args[1]) {
              args[1].credentials = 'include';
            } else {
              args[1] = { credentials: 'include' };
            }
            return originalFetch.apply(this, args);
          };
        }
      });
    `
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

  // Serve the raw OpenAPI JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export { specs };