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
						name: 'Create Ticket',
						value: 'createTicket',
						description: 'Creates a new Ticket in Tanss',
						action: 'Creates a new ticket',
					},
					{
						name: 'Delete Ticket',
						value: 'deleteTicket',
						description: 'Deletes a ticket',
						action: 'Deletes a ticket',
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
						name: 'Merge Tickets',
						value: 'mergeTickets',
						description: 'Merges one ticket into another',
						action: 'Merges one ticket into another',
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
						operation: [
							'getTicketById',
							'createComment',
							'getTicketHistory',
							'updateTicket',
							'deleteTicket',
							'mergeTickets',
						],
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
						operation: ['deleteTicket', 'mergeTickets'],
					},
				},
				default: 0,
				description: 'ID of the target ticket for migrating or merging entities',
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
			{
				displayName: 'Create Ticket Fields',
				name: 'createTicketFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['createTicket'],
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
					{ displayName: 'Link Type ID', name: 'linkTypeId', type: 'number', default: 0 },
					{ displayName: 'Link ID', name: 'linkId', type: 'number', default: 0 },
					{ displayName: 'Deadline Date (Timestamp)', name: 'deadlineDate', type: 'number', default: 0 },
					{ displayName: 'Project', name: 'project', type: 'boolean', default: false },
					{ displayName: 'Project ID', name: 'projectId', type: 'number', default: 0 },
					{ displayName: 'Repair', name: 'repair', type: 'boolean', default: false },
					{ displayName: 'Due Date (Timestamp)', name: 'dueDate', type: 'number', default: 0 },
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
					{ displayName: 'Order By ID', name: 'orderById', type: 'number', default: 0 },
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
					{
						displayName: 'Installation Fee Drive Mode',
						name: 'installationFeeDriveMode',
						type: 'options',
						options: [
							{ name: 'None (Default Behavior)', value: 'NONE' },
							{ name: 'Drive Included', value: 'DRIVE_INCLUDED' },
							{ name: 'Drive Excluded', value: 'DRIVE_EXCLUDED' },
						],
						default: 'NONE',
					},
					{ displayName: 'Installation Fee Amount', name: 'installationFeeAmount', type: 'number', default: 0 },
					{ displayName: 'Separate Billing', name: 'separateBilling', type: 'boolean', default: false },
					{ displayName: 'Service Cap Amount', name: 'serviceCapAmount', type: 'number', default: 0 },
					{ displayName: 'Relationship Link Type ID', name: 'relationshipLinkTypeId', type: 'number', default: 0 },
					{ displayName: 'Relationship Link ID', name: 'relationshipLinkId', type: 'number', default: 0 },
					{ displayName: 'Resubmission Date (Timestamp)', name: 'resubmissionDate', type: 'number', default: 0 },
					{ displayName: 'Estimated Minutes', name: 'estimatedMinutes', type: 'number', default: 0 },
					{
						displayName: 'Local Ticket Admin Flag',
						name: 'localTicketAdminFlag',
						type: 'options',
						options: [
							{ name: 'None', value: 'NONE' },
							{ name: 'Local Admin', value: 'LOCAL_ADMIN' },
							{ name: 'Technician', value: 'TECHNICIAN' },
						],
						default: 'NONE',
					},
					{ displayName: 'Local Ticket Admin Employee ID', name: 'localTicketAdminEmployeeId', type: 'number', default: 0 },
					{ displayName: 'Phase ID', name: 'phaseId', type: 'number', default: 0 },
					{ displayName: 'Resubmission Text', name: 'resubmissionText', type: 'string', default: '' },
					{ displayName: 'Order Number', name: 'orderNumber', type: 'string', default: '' },
					{ displayName: 'Reminder (Timestamp)', name: 'reminder', type: 'number', default: 0 },
					{
						displayName: 'Clearance Mode',
						name: 'clearanceMode',
						type: 'options',
						options: [
							{ name: 'Default', value: 'DEFAULT' },
							{ name: 'Don\'t Clear Supports', value: 'DONT_CLEAR_SUPPORTS' },
							{ name: 'May Clear Supports', value: 'MAY_CLEAR_SUPPORTS' },
						],
						default: 'DEFAULT',
					},
					{
						displayName: 'Sub Tickets',
						name: 'subTickets',
						type: 'json',
						default: '',
						description: 'An array of objects to immediately assign sub-tickets if creating a project',
					},
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'json',
						default: '',
						description: 'An array of objects with tag assignments which will be assigned to the ticket',
					},
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

				case 'createTicket':
					url = `${credentials.baseURL}/backend/api/v1/tickets`;
					requestOptions.method = 'POST';
					const createTicketFields = this.getNodeParameter('createTicketFields', i, {}) as Record<string, any>;
					if (Object.keys(createTicketFields).length === 0) {
						throw new NodeOperationError(this.getNode(), 'No fields provided for ticket creation.');
					}

					requestOptions.body = createTicketFields;
					break;

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

				case 'mergeTickets':
					const mergeTargetId = this.getNodeParameter('targetTicketId', i, 0) as number;
					url = `${credentials.baseURL}/backend/api/v1/tickets/${ticketId}/merge/${mergeTargetId}`;
					requestOptions.method = 'PUT';
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
