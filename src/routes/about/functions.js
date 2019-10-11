export const mapDates = arr =>
	arr.map(obj => {
		let startDate = obj.startDate ? new Date(obj.startDate) : new Date();
		let endDate = obj.endDate ? new Date(obj.endDate) : undefined;

		return {
			...obj,
			startDate,
			endDate
		};
	});

export const sortByDate = (a, b) => {
	if (!b.endDate) {
		if (!a.endDate) {
			// If both are null, sort by start date.
			return b.startDate > a.startDate;
		}
		// If just b has no end, then b is most recent.
		return 1;
	} else if (!a.endDate) {
		// If a has no end, then a is most recent.
		return -1;
	} else {
		// If both have end dates, sort by end date.
		return b.endDate > a.endDate;
	}
};

export const formatDate = d => {
	if (!d) return 'present';

	let day = d.getDate();
	let month = d.getMonth() + 1;
	let year = d.getFullYear();

	return `${month}/${year}`;
};
