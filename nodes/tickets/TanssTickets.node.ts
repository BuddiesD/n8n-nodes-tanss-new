import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError } from 'n8n-workflow';

export class TanssTickets implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TANSS Tickets',
		name: 'tanssTickets',
		icon: 'file:tanss.svg',
		group: ['transform'],
		version: 1,
		description: 'Handles ticket operations in TANSS API',
		defaults: {
			name: 'TANSS Tickets',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tanssApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Comment',
						value: 'createComment',
						description: 'Creates a comment for a specific ticket',
						action: 'Creates a comment for a specific ticket',
					},
					{
						name: 'Delete Ticket',
						value: 'deleteTicket',
						description: 'Deletes a ticket with optional migration of entities',
						action: 'Deletes a ticket with optional migration of entities',
					},
					{
						name: 'Get Ticket by ID',
						value: 'getTicketById',
						description: 'Fetches a ticket by ID',
						action: 'Fetches a ticket by ID',
					},
					{
						name: 'Get Ticket History',
						value: 'getTicketHistory',
						description: 'Fetches the history of a ticket',
						action: 'Fetches the history of a ticket',
					},
					{
						name: 'Update Ticket',
						value: 'updateTicket',
						description: 'Updates a ticket with the provided details',
						action: 'Updates a ticket with the provided details',
					},
				],
				default: 'getTicketById',
			},
			{
				displayName: 'API Token',
				name: 'apiToken',
				type: 'string',
				required: true,
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'API token obtained from the TANSS API login',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getTicketById', 'createComment', 'getTicketHistory', 'updateTicket', 'deleteTicket'],
					},
				},
				default: 0,
				description: 'ID of the ticket',
			},
			{
				displayName: 'Target Ticket ID',
				name: 'targetTicketId',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['deleteTicket'],
					},
				},
				default: 0,
				description: 'Optional ID of the target ticket for migrating entities',
			},
			{
				displayName: 'Comment Title',
				name: 'commentTitle',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createComment'],
					},
				},
				default: '',
				description: 'Title of the comment',
			},
			{
				displayName: 'Comment Content',
				name: 'commentContent',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createComment'],
					},
				},
				default: '',
				description: 'Content of the comment',
			},
			{
				displayName: 'Internal',
				name: 'internal',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['createComment'],
					},
				},
				default: false,
				description: 'Whether the comment is internal or public',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['updateTicket'],
					},
				},
				default: {},
				options: [
					{ displayName: 'Company ID', name: 'companyId', type: 'number', default: 0 },
					{ displayName: 'Remitter ID', name: 'remitterId', type: 'number', default: 0 },
					{ displayName: 'Title', name: 'title', type: 'string', default: '' },
					{ displayName: 'Content', name: 'content', type: 'string', default: '' },
					{ displayName: 'External Ticket ID', name: 'extTicketId', type: 'string', default: '' },
					{ displayName: 'Assigned to Employee ID', name: 'assignedToEmployeeId', type: 'number', default: 0 },
					{ displayName: 'Assigned to Department ID', name: 'assignedToDepartmentId', type: 'number', default: 0 },
					{ displayName: 'Status ID', name: 'statusId', type: 'number', default: 0 },
					{ displayName: 'Type ID', name: 'typeId', type: 'number', default: 0 },
					{ displayName: 'Deadline Date', name: 'deadlineDate', type: 'number', default: 0 },
					{ displayName: 'Due Date', name: 'dueDate', type: 'number', default: 0 },
					{
						displayName: 'Attention',
						name: 'attention',
						type: 'options',
						options: [
							{ name: 'No', value: 'NO' },
							{ name: 'Yes', value: 'YES' },
							{ name: 'Resubmission', value: 'RESUBMISSION' },
							{ name: 'Mail', value: 'MAIL' },
						],
						default: 'NO',
					},
					{
						displayName: 'Installation Fee',
						name: 'installationFee',
						type: 'options',
						options: [
							{ name: 'No', value: 'NO' },
							{ name: 'Yes', value: 'YES' },
							{ name: 'No Project Installation Fee', value: 'NO_PROJECT_INSTALLATION_FEE' },
						],
						default: 'NO',
					},
					{ displayName: 'Relationship Link Type ID', name: 'relationshipLinkTypeId', type: 'number', default: 0 },
					{ displayName: 'Relationship Link ID', name: 'relationshipLinkId', type: 'number', default: 0 },
					{ displayName: 'Resubmission Date', name: 'resubmissionDate', type: 'number', default: 0 },
					{ displayName: 'Estimated Minutes', name: 'estimatedMinutes', type: 'number', default: 0 },
					{ displayName: 'Phase ID', name: 'phaseId', type: 'number', default: 0 },
					{ displayName: 'Order Number', name: 'orderNumber', type: 'string', default: '' },
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('tanssApi');

		if (!credentials) {
			throw new NodeOperationError(this.getNode(), 'No credentials returned!');
		}

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const apiToken = this.getNodeParameter('apiToken', i, '') as string;
			const ticketId = this.getNodeParameter('ticketId', i, 0) as number;

			let url: string;
			let requestOptions: {
				method: 'GET' | 'POST' | 'PUT' | 'DELETE';
				headers: { apiToken: string; 'Content-Type': string };
				json: boolean;
				body?: any;
				url: string;
			} = {
				method: 'GET',
				headers: {
					apiToken,
					'Content-Type': 'application/json',
				},
				json: true,
				url: '',
			};

			switch (operation) {
				case 'getTicketById':
					url = `${credentials.baseURL}/backend/api/v1/tickets/${ticketId}`;
					requestOptions.method = 'GET';
					break;

				case 'getTicketHistory':
					url = `${credentials.baseURL}/backend/api/v1/tickets/history/${ticketId}`;
					requestOptions.method = 'GET';
					break;

				case 'createComment':
					const commentTitle = this.getNodeParameter('commentTitle', i) as string;
					const commentContent = this.getNodeParameter('commentContent', i) as string;
					const internal = this.getNodeParameter('internal', i) as boolean;

					url = `${credentials.baseURL}/backend/api/v1/tickets/${ticketId}/comments`;
					requestOptions.method = 'POST';
					requestOptions.body = { title: commentTitle, content: commentContent, internal };
					break;

				case 'updateTicket':
					url = `${credentials.baseURL}/backend/api/v1/tickets/${ticketId}`;
					const updateFields = this.getNodeParameter('updateFields', i, {}) as Record<string, any>;

					if (Object.keys(updateFields).length === 0) {
						throw new NodeOperationError(this.getNode(), 'No fields to update were provided.');
					}

					requestOptions.method = 'PUT';
					requestOptions.body = updateFields;
					break;

				case 'deleteTicket':
					const targetTicketId = this.getNodeParameter('targetTicketId', i, 0) as number;
					url = `${credentials.baseURL}/backend/api/v1/tickets/${ticketId}`;
					requestOptions.method = 'DELETE';
					if (targetTicketId) {
						url += `?targetTicketId=${targetTicketId}`;
					}
					break;

				default:
					throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
			}

			requestOptions.url = url;

			try {
				const responseData = await this.helpers.request(requestOptions);
				returnData.push({ json: responseData });
			} catch (error) {
				throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${error.message}`);
			}
		}

		return [returnData];
	}
}
