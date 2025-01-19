import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TanssApi implements ICredentialType {
	name = 'tanssApi';
	displayName = 'TANSS API';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseURL',
			type: 'string',
			default: '',
			placeholder: 'https://your-tanss-api-url.com',
			required: true,
			description: 'The base URL of the TANSS API.',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'The username to authenticate with the TANSS API.',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true,
			description: 'The password to authenticate with the TANSS API.',
		},
	];
}
