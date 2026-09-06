import {
	AccessFlowGraph,
	type AccessFlowEdge,
	type AccessFlowNode,
	type AccessFlowProps
} from './AccessFlow';

export type AccessFlowAltProps = Omit<AccessFlowProps, 'nodeHeight'>;

const nodes: AccessFlowNode[] = [
	{
		id: 'origin',
		kind: 'desktop',
		name: 'Accounting-DB-2',
		location: 'US East',
		priority: 'High',
		score: 72,
		reference: 'MITRE T1195',
		description: 'Remote code execution on pulse server detected.',
		x: 0,
		y: 5 / 9
	},
	{
		id: 'destination',
		kind: 'desktop',
		name: 'Accounting-DB-2',
		location: 'US East',
		priority: 'High',
		score: 72,
		reference: 'MITRE T1195',
		description: 'Remote code execution on pulse server detected.',
		x: 26 / 38,
		y: 5 / 9
	},
	{
		id: 'escalation',
		kind: 'desktop',
		name: 'Accounting-DB-2',
		location: 'US East',
		priority: 'High',
		score: 72,
		reference: 'MITRE T1195',
		description: 'Remote code execution on pulse server detected.',
		x: 26 / 38,
		y: 0
	}
];

const activity = [
	0.16, 0.72, 0.43, 0.11, 0.64, 0.22, 0.81, 0.31, 0.14, 0.58, 0.39, 0.09, 0.53, 0.24, 0.76, 0.17,
	0.46, 0.28, 0.08, 0.61, 0.35, 0.12, 0.49, 0.21
];

const edges: AccessFlowEdge[] = [
	{
		id: 'remote-upper',
		source: 'origin',
		target: 'destination',
		label: 'REMOTE ACCESS',
		activity,
		offset: -52
	},
	{
		id: 'remote-lower',
		source: 'origin',
		target: 'destination',
		label: 'REMOTE ACCESS',
		offset: 52
	},
	{ id: 'escalation', source: 'destination', target: 'escalation' }
];

export function AccessFlowAlt({
	nodes: customNodes = nodes,
	edges: customEdges = edges,
	onNodeSelect,
	onEdgeSelect
}: AccessFlowAltProps) {
	return (
		<AccessFlowGraph
			nodes={customNodes}
			edges={customEdges}
			nodeHeight={4 / 9}
			onNodeSelect={onNodeSelect}
			onEdgeSelect={onEdgeSelect}
		/>
	);
}
