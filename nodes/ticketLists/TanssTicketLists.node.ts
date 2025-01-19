import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError } from 'n8n-workflow';

export class TanssTicketLists implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TANSS Ticket Lists',
		name: 'tanssTicketLists',
		icon: 'file:tanss.svg',
		group: ['transform'],
		version: 1,
		description: 'Handles ticket lists in TANSS API',
		defaults: {
			name: 'TANSS Ticket Lists',
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
						name: 'Get Company Tickets',
						value: 'getCompanyTickets',
						description: 'Get tickets for a specific company',
						action: 'Get tickets for a specific company',
					},
					{
						name: 'Get General Tickets',
						value: 'getGeneralTickets',
						description: 'Get general tickets assigned to no employee',
						action: 'Get general tickets assigned to no employee',
					},
					{
						name: 'Get Not Identified Tickets',
						value: 'getNotIdentifiedTickets',
						description: 'Get tickets not assigned to any company',
						action: 'Get tickets not assigned to any company',
					},
					{
						name: 'Get Own Tickets',
						value: 'getOwnTickets',
						description: 'Get tickets assigned to the current employee',
						action: 'Get tickets assigned to the current employee',
					},
					{
						name: 'Get Project Tickets',
						value: 'getProjectTickets',
						description: 'Get tickets associated with projects',
						action: 'Get tickets associated with projects',
					},
					{
						name: 'Get Technician Tickets',
						value: 'getTechnicianTickets',
						description: 'Get tickets assigned to other technicians',
						action: 'Get tickets assigned to other technicians',
					},
				],
				default: 'getOwnTickets',
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
				displayName: 'Company ID',
				name: 'companyId',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getCompanyTickets'],
					},
				},
				default: 0,
				description: 'ID of the company for which to fetch tickets',
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

			let url: string;
			const requestOptions: {
				method: 'GET';
				headers: { apiToken: string; 'Content-Type': string };
				json: boolean;
				url?: string;
			} = {
				method: 'GET',
				headers: {
					apiToken,
					'Content-Type': 'application/json',
				},
				json: true,
			};

			switch (operation) {
				case 'getOwnTickets':
					url = `${credentials.baseURL}/backend/api/v1/tickets/own`;
					break;
				case 'getGeneralTickets':
					url = `${credentials.baseURL}/backend/api/v1/tickets/general`;
					break;
				case 'getCompanyTickets':
					const companyId = this.getNodeParameter('companyId', i) as number;
					url = `${credentials.baseURL}/backend/api/v1/tickets/company/${companyId}`;
					break;
				case 'getNotIdentifiedTickets':
					url = `${credentials.baseURL}/backend/api/v1/tickets/notIdentified`;
					break;
				case 'getProjectTickets':
					url = `${credentials.baseURL}/backend/api/v1/tickets/projects`;
					break;
				case 'getTechnicianTickets':
					url = `${credentials.baseURL}/backend/api/v1/tickets/technician`;
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
