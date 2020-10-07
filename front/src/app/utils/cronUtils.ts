const stEnd = ['1', '21', '31', '41', '51'];

const ndEnd = ['2', '22', '32', '42', '52'];

const rdEnd = ['3', '23', '33', '43', '53'];

function getTimeEnding(param: string){
    let ending = '';
    if (stEnd.includes(param)){
        ending += 'st';
    }
    else if (ndEnd.includes(param)){
        ending += 'nd';
    }
    else if (rdEnd.includes(param)){
        ending += 'rd';
    }
    else{
        ending += 'th';
    }

    return ending;
}

// Convierte a lenguaje natural la información de un cron
export function getHumanReadableCron(hourType: string, minuteType: string, hours: string, minutes: string){
    let cronString = 'At ';

    if (minuteType === 'at' && hourType === 'at'){
        cronString += hours + ':' + minutes;
    }
    else{
        switch (minuteType){
            case 'each one':
                cronString += 'every minute';
                break;
            case 'at':
                cronString += minutes + 'minute';
                break;
            case 'from':
                const startEnd = minutes.split('-');
                cronString += 'every minute from ' + startEnd[0] + ' through ' + startEnd[1];
                break;
            case 'every':
                cronString += 'every ' + minutes;
                cronString += getTimeEnding(minutes) + '  minute';
                break;
            default:
                break;
        }

        switch (hourType){
            case 'at':
                cronString += ' past hour ' + hours;
                break;
            case 'from':
                const startEnd = hours.split('-');
                cronString += ' past every hour from ' + startEnd[0] + ' through ' + startEnd[1];
                break;
            case 'every':
                cronString += ' past every ' + hours;
                cronString += getTimeEnding(hours) + '  hour';
                break;
            case 'specific':
                const specificHours = hours.split(',');
                if (hours.length > 1){
                    cronString += ' past hour ';
                    for (const hour of specificHours.slice(0, -1)){
                        cronString += hour + ', ';
                    }
                    cronString += 'and ' + specificHours[specificHours.length - 1];
                }
                else{
                    cronString += ' past hour ' + specificHours[0];
                }
                break;
            default:
                break;
        }
    }

    return cronString;
}
