import { IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError } from 'n8n-workflow';

export class TanssAuthentication implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TANSS Authentication',
		name: 'tanssAuthentication',
		icon: 'file:tanss.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Handles TANSS API Authentication',
		defaults: {
			name: 'TANSS Authentication',
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
				options: [
					{
						name: 'Login',
						value: 'login',
						description: 'Login to the TANSS API',
						action: 'Login to the TANSS API',
					},
				],
				default: 'login',
				noDataExpression: true,
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

			if (operation === 'login') {
				const username = credentials.username as string;
				const password = credentials.password as string;
				const baseURL = credentials.baseURL as string;
				const url = `${baseURL.replace(/\/+$/, '')}/backend/api/v1/login`;

				const requestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url,
					body: { username, password },
					json: true,
				};

				try {
					const responseData = await this.helpers.request(requestOptions);
					returnData.push({ json: responseData });
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Login failed: ${error.message}`);
				}
			} else {
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
			}
		}

		return [returnData];
	}
}
