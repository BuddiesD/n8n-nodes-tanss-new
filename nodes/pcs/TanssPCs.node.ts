import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError } from 'n8n-workflow';

export class TanssPCs implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TANSS PCs',
		name: 'tanssPCs',
		icon: 'file:tanss.svg',
		group: ['transform'],
		version: 1,
		description: 'Handles PC operations in TANSS API',
		defaults: {
			name: 'TANSS PCs',
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
						name: 'Get PC by ID',
						value: 'getPcById',
						description: 'Fetches a PC or server by a given ID',
						action: 'Fetches a PC by ID',
					},
					{
						name: 'Update PC',
						value: 'updatePc',
						description: 'Updates a PC or server',
						action: 'Updates a PC',
					},
					{
						name: 'Create PC',
						value: 'createPc',
						description: 'Creates a new PC or server',
						action: 'Creates a PC',
					},
					{
						name: 'Delete PC',
						value: 'deletePc',
						description: 'Deletes a PC or server',
						action: 'Deletes a PC',
					},
				],
				default: 'getPcById',
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
				description: 'Enter the API token for the TANSS API',
			},
			{
				displayName: 'PC ID',
				name: 'pcId',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getPcById', 'updatePc', 'deletePc'],
					},
				},
				default: 0,
				description: 'ID of the PC or server',
			},
			{
				displayName: 'PC Data',
				name: 'pcData',
				type: 'collection',
				displayOptions: {
					show: {
						operation: ['updatePc', 'createPc'],
					},
				},
				default: {},
				placeholder: 'Add Field',
				options: [
					{ displayName: 'Inventory Number', name: 'inventoryNumber', type: 'string', default: '' },
					{ displayName: 'Active', name: 'active', type: 'boolean', default: false },
					{ displayName: 'Company ID', name: 'companyId', type: 'number', default: 0 },
					{ displayName: 'Name', name: 'name', type: 'string', default: '' },
					{ displayName: 'Service Technician ID', name: 'serviceTechnicianId', type: 'number', default: 0 },
					{ displayName: 'Employee ID', name: 'employeeId', type: 'number', default: 0 },
					{ displayName: 'Date', name: 'date', type: 'number', default: 0 },
					{ displayName: 'Location', name: 'location', type: 'string', default: '' },
					{ displayName: 'Manufacturer ID', name: 'manufacturerId', type: 'number', default: 0 },
					{ displayName: 'Model', name: 'model', type: 'string', default: '' },
					{ displayName: 'Serial Number', name: 'serialNumber', type: 'string', default: '' },
					{ displayName: 'OS ID', name: 'osId', type: 'number', default: 0 },
					{ displayName: 'Software', name: 'software', type: 'string', default: '' },
					{ displayName: 'Remark', name: 'remark', type: 'string', default: '' },
					{ displayName: 'Show Remark', name: 'showRemark', type: 'boolean', default: false },
					{ displayName: 'Mainboard Manufacturer ID', name: 'mainboardManufacturerId', type: 'number', default: 0 },
					{ displayName: 'Mainboard Manufacturer Revision', name: 'mainboardManufacturerRevision', type: 'string', default: '' },
					{ displayName: 'Mainboard Serial Number', name: 'mainboardSerialNumber', type: 'string', default: '' },
					{ displayName: 'BIOS', name: 'bios', type: 'string', default: '' },
					{ displayName: 'BIOS Release', name: 'biosRelease', type: 'string', default: '' },
					{ displayName: 'CPU Manufacturer ID', name: 'cpuManufacturerId', type: 'number', default: 0 },
					{ displayName: 'CPU Type ID', name: 'cpuTypeId', type: 'number', default: 0 },
					{ displayName: 'CPU Frequency', name: 'cpuFrequency', type: 'number', default: 0 },
					{ displayName: 'CPU Number', name: 'cpuNumber', type: 'number', default: 0 },
					{ displayName: 'Mouse Serial Number', name: 'mouseSerialNumber', type: 'string', default: '' },
					{ displayName: 'Keyboard Serial Number', name: 'keyboardSerialNumber', type: 'string', default: '' },
					{ displayName: 'Server', name: 'server', type: 'boolean', default: false },
					{ displayName: 'Internal Remark', name: 'internalRemark', type: 'string', default: '' },
					{ displayName: 'Billing Number', name: 'billingNumber', type: 'string', default: '' },
					{ displayName: 'Article Number', name: 'articleNumber', type: 'string', default: '' },
					{ displayName: 'Manufacturer Number', name: 'manufacturerNumber', type: 'string', default: '' },
					{ displayName: 'Host ID', name: 'hostId', type: 'number', default: 0 },
					{ displayName: 'Purchase Price', name: 'purchasePrice', type: 'number', default: 0 },
					{ displayName: 'Selling Price', name: 'sellingPrice', type: 'number', default: 0 },
					{
						displayName: 'Ownage Type',
						name: 'ownageType',
						type: 'options',
						options: [
							{ name: 'Own', value: 'OWN' },
							{ name: 'Foreign', value: 'FOREIGN' },
							{ name: 'Own Rent', value: 'OWN_RENT' },
							{ name: 'Foreign Rent', value: 'FOREIGN_RENT' },
						],
						default: 'OWN',
					},
					{ displayName: 'Storage ID', name: 'storageId', type: 'number', default: 0 },
					{ displayName: 'TeamViewer ID', name: 'teamviewerId', type: 'string', default: '' },
					{ displayName: 'TeamViewer Password', name: 'teamviewerPassword', type: 'string', default: '', typeOptions: { password: true } },
					{ displayName: 'AnyDesk ID', name: 'anydeskId', type: 'string', default: '' },
					{ displayName: 'AnyDesk Password', name: 'anydeskPassword', type: 'string', default: '', typeOptions: { password: true } },
					{ displayName: 'Reserved RAM', name: 'reservedRam', type: 'number', default: 0 },
					{ displayName: 'Reserved Hard Disk', name: 'reservedHardDisk', type: 'number', default: 0 },
					{ displayName: 'Reserved CPU', name: 'reservedCpu', type: 'number', default: 0 },
					{ displayName: 'Description', name: 'description', type: 'string', default: '' },
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
			const pcId = this.getNodeParameter('pcId', i, 0) as number;
			let pcData = this.getNodeParameter('pcData', i, {}) as Record<string, any>;

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
				case 'getPcById':
					url = `${credentials.baseURL}/backend/api/v1/pcs/${pcId}`;
					requestOptions.method = 'GET';
					break;

				case 'updatePc':
					url = `${credentials.baseURL}/backend/api/v1/pcs/${pcId}`;
					if (Object.keys(pcData).length === 0) {
						throw new NodeOperationError(this.getNode(), 'No data provided for updating the PC.');
					}
					requestOptions.method = 'PUT';
					requestOptions.body = pcData;
					break;

				case 'createPc':
					url = `${credentials.baseURL}/backend/api/v1/pcs`;
					if (Object.keys(pcData).length === 0) {
						throw new NodeOperationError(this.getNode(), 'No data provided for creating the PC.');
					}
					requestOptions.method = 'POST';
					requestOptions.body = pcData;
					break;

				case 'deletePc':
					url = `${credentials.baseURL}/backend/api/v1/pcs/${pcId}`;
					requestOptions.method = 'DELETE';
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
