# TANSS API Integration for n8n

This repository contains custom n8n nodes for interacting with the TANSS API. The nodes provide functionalities to manage tickets, authentication, and ticket lists within the TANSS system.

## Features

- **Authentication**: Log in to the TANSS API using credentials.
- **Ticket Management**:
  - Fetch a ticket by ID.
  - Create comments for tickets.
  - Get ticket history.
  - Update ticket details.
  - Delete tickets with optional migration of entities.
- **Ticket Lists**:
  - Fetch tickets assigned to the current employee.
  - Fetch general tickets not assigned to any employee.
  - Fetch tickets for a specific company.
  - Fetch tickets not associated with any company.
  - Fetch project-related tickets.
  - Fetch tickets assigned to other technicians.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/BuddiesD/n8n-nodes-tanss-new.git
