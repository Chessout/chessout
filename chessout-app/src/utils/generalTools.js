export function intlNumberFormat(number, locales, minDigits, maxDigits) {
	const options = {
		minimumFractionDigits: minDigits !== undefined ? minDigits : 2,
		maximumFractionDigits: maxDigits !== undefined ? maxDigits : 2,
	};

	return new Intl.NumberFormat(locales ? locales : "en-GB", options).format(number);
}

export const openInNewTab = (url) => {
	const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
	if (newWindow) newWindow.opener = null;
};

export const openInSameTab = (url) => {
	const newWindow = window.open(url, '_self', 'noopener,noreferrer')
	if (newWindow) newWindow.opener = null;
};

export var multiplier = 1000000000000000000;

export const getPostTime = (timestamp) => {
	const currentTimestamp = Date.now();
	const timeDifference = currentTimestamp - timestamp;
	if (timeDifference <= 60000) {
		return 'a minute ago';
	} else if (timeDifference <= 3600000) {
		const minutes = Math.floor(timeDifference / 60000);
		return `${minutes > 1 ? minutes : 'a'} minute${minutes > 1 ? 's' : ''} ago`;
	} else if (timeDifference <= 86400000) {
		const hours = Math.floor(timeDifference / 3600000);
		return `${hours > 1 ? hours : 'an'} hour${hours > 1 ? 's' : ''} ago`;
	} else if (timeDifference <= 604800000) {
		const days = Math.floor(timeDifference / 86400000);
		return `${days > 1 ? days : 'a'} day${days > 1 ? 's' : ''} ago`;
	} else if (timeDifference <= 2419200000) {
		const weeks = Math.floor(timeDifference / 604800000);
		return `${weeks > 1 ? weeks : 'a'} week${weeks > 1 ? 's' : ''} ago`;
	} else if (timeDifference <= 29030400000) {
		const months = Math.floor(timeDifference / 2419200000);
		return `${months > 1 ? months : 'a'} month${months > 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(timeDifference / 29030400000);
		return `${years > 1 ? years : 'a'} year${years > 1 ? 's' : ''} ago`;
	}
};

export const getCommentTime = (timestamp) => {
	const currentTimestamp = Date.now();
	const commentTimeDiff = currentTimestamp - timestamp;
	if (commentTimeDiff <= 60000) {
		return '1 min';
	} else if (commentTimeDiff <= 3600000) {
		const minutes = Math.floor(commentTimeDiff / 60000);
		return `${minutes}min`;
	} else if (commentTimeDiff <= 86400000) {
		const hours = Math.floor(commentTimeDiff / 3600000);
		return `${hours}h`;
	} else if (commentTimeDiff <= 604800000) {
		const days = Math.floor(commentTimeDiff / 86400000);
		return `${days}d`;
	} else if (commentTimeDiff <= 2419200000) {
		const weeks = Math.floor(commentTimeDiff / 604800000);
		return `${weeks > 1 ? weeks : '1'} week${weeks > 1 ? 's' : ''}`;
	} else if (commentTimeDiff <= 29030400000) {
		const months = Math.floor(commentTimeDiff / 2419200000);
		return `${months > 1 ? months : '1'} month${months > 1 ? 's' : ''}`;
	} else {
		const years = Math.floor(commentTimeDiff / 29030400000);
		return `${years > 1 ? years : '1'} year${years > 1 ? 's' : ''}`;
	}
};