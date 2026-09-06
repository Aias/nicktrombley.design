import { AccessFlow } from '../components/mockups/AccessFlow';
import { AccessFlowAlt } from '../components/mockups/AccessFlowAlt';
import { ActivityTimeline } from '../components/mockups/ActivityTimeline';
import { Agenda } from '../components/mockups/Agenda';
import { BigButton } from '../components/mockups/BigButton';
import { DistributionTable } from '../components/mockups/DistributionTable';
import { ExtractList } from '../components/mockups/ExtractList';
import { Hierarchy } from '../components/mockups/Hierarchy';
import { Icons } from '../components/mockups/Icons';
import { ImpactAnalysis } from '../components/mockups/ImpactAnalysis';
import { JourneyMap } from '../components/mockups/JourneyMap';
import { Metadata } from '../components/mockups/Metadata';
import { MultiMeasure } from '../components/mockups/MultiMeasure';
import { Pattern } from '../components/mockups/Pattern';
import { RuleBuilder } from '../components/mockups/RuleBuilder';
import { SingleMetric } from '../components/mockups/SingleMetric';
import { TaskList } from '../components/mockups/TaskList';
import { Timeline } from '../components/mockups/Timeline';
import { Treemap } from '../components/mockups/Treemap';
import { UserDetails } from '../components/mockups/UserDetails';
import { VariableAnalysis } from '../components/mockups/VariableAnalysis';
import { VariableSelection } from '../components/mockups/VariableSelection';
import type { PortfolioItem } from '../types/portfolio';

export const portfolioItems = [
	{
		id: 'access-flow',
		content: <AccessFlow />,
		screens: 'large',
		xCells: 53,
		yCells: 27,
		widthCells: 19,
		heightCells: 10,
		small: { xCells: 0, yCells: 0 }
	},
	{
		id: 'access-flow--alt',
		content: <AccessFlowAlt />,
		screens: 'small',
		xCells: 0,
		yCells: 0,
		widthCells: 19,
		heightCells: 9,
		small: { xCells: 20, yCells: 27 }
	},
	{
		id: 'activity-timeline',
		content: <ActivityTimeline />,
		screens: 'all',
		xCells: 0,
		yCells: 36,
		widthCells: 19,
		heightCells: 12,
		small: { xCells: 0, yCells: 0 }
	},
	{
		id: 'agenda',
		content: <Agenda />,
		screens: 'all',
		xCells: 33,
		yCells: 0,
		widthCells: 8,
		heightCells: 7,
		small: { xCells: 53, yCells: 10 }
	},
	{
		id: 'big-button',
		content: <BigButton />,
		screens: 'all',
		xCells: 20,
		yCells: 0,
		widthCells: 12,
		heightCells: 4,
		small: { xCells: 20, yCells: 27 }
	},
	{
		id: 'distribution-table',
		content: <DistributionTable />,
		screens: 'all',
		xCells: 42,
		yCells: 0,
		widthCells: 19,
		heightCells: 7,
		small: { xCells: 33, yCells: 10 }
	},
	{
		id: 'extract-list',
		content: <ExtractList />,
		screens: 'all',
		xCells: 53,
		yCells: 18,
		widthCells: 12,
		heightCells: 13,
		small: { xCells: 20, yCells: 0 }
	},
	{
		id: 'hierarchy',
		content: <Hierarchy />,
		screens: 'all',
		xCells: 10,
		yCells: 12,
		widthCells: 9,
		heightCells: 13,
		small: { xCells: 10, yCells: 23 }
	},
	{
		id: 'icons',
		content: <Icons />,
		screens: 'large',
		xCells: 53,
		yCells: 37,
		widthCells: 6,
		heightCells: 11,
		small: { xCells: 0, yCells: 0 }
	},
	{
		id: 'impact-analysis',
		content: <ImpactAnalysis />,
		screens: 'all',
		xCells: 20,
		yCells: 41,
		widthCells: 20,
		heightCells: 7,
		small: { xCells: 52, yCells: 18 }
	},
	{
		id: 'journey-map',
		content: <JourneyMap />,
		screens: 'large',
		xCells: 0,
		yCells: 0,
		widthCells: 19,
		heightCells: 11,
		small: { xCells: 0, yCells: 0 }
	},
	{
		id: 'metadata',
		content: <Metadata />,
		screens: 'all',
		xCells: 0,
		yCells: 12,
		widthCells: 9,
		heightCells: 23,
		small: { xCells: 0, yCells: 13 }
	},
	{
		id: 'multi-measure',
		content: <MultiMeasure />,
		screens: 'all',
		xCells: 49,
		yCells: 8,
		widthCells: 12,
		heightCells: 9,
		small: { xCells: 33, yCells: 0 }
	},
	{
		id: 'pattern',
		content: <Pattern />,
		screens: 'all',
		xCells: 66,
		yCells: 18,
		widthCells: 6,
		heightCells: 8,
		small: { xCells: 33, yCells: 18 }
	},
	{
		id: 'rule-builder',
		content: <RuleBuilder />,
		screens: 'all',
		xCells: 41,
		yCells: 30,
		widthCells: 11,
		heightCells: 18,
		small: { xCells: 40, yCells: 18 }
	},
	{
		id: 'single-metric',
		content: <SingleMetric />,
		screens: 'all',
		xCells: 10,
		yCells: 26,
		widthCells: 9,
		heightCells: 9,
		small: { xCells: 10, yCells: 13 }
	},
	{
		id: 'task-list',
		content: <TaskList />,
		screens: 'all',
		xCells: 62,
		yCells: 0,
		widthCells: 10,
		heightCells: 17,
		small: { xCells: 62, yCells: 0 }
	},
	{
		id: 'timeline',
		content: <Timeline />,
		screens: 'all',
		xCells: 20,
		yCells: 30,
		widthCells: 9,
		heightCells: 10,
		small: { xCells: 63, yCells: 26 }
	},
	{
		id: 'treemap',
		content: <Treemap />,
		screens: 'large',
		xCells: 60,
		yCells: 38,
		widthCells: 12,
		heightCells: 10,
		small: { xCells: 0, yCells: 0 }
	},
	{
		id: 'user-details',
		content: <UserDetails />,
		screens: 'all',
		xCells: 20,
		yCells: 5,
		widthCells: 12,
		heightCells: 12,
		small: { xCells: 20, yCells: 14 }
	},
	{
		id: 'variable-analysis',
		content: <VariableAnalysis />,
		screens: 'all',
		xCells: 33,
		yCells: 8,
		widthCells: 15,
		heightCells: 9,
		small: { xCells: 46, yCells: 0 }
	},
	{
		id: 'variable-selection',
		content: <VariableSelection />,
		screens: 'all',
		xCells: 30,
		yCells: 30,
		widthCells: 10,
		heightCells: 10,
		small: { xCells: 52, yCells: 26 }
	}
] satisfies PortfolioItem[];
