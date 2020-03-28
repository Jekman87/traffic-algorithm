const countries = [
    'Россия',
    'Беларусь',
    'Украина',
    'Казахстан',
    'Узбекистан',
    'Туркменистан',
    'Турция',
    'Англия',
    'Франция',
    'Италия',
];

const users = [
    {name: 'Вася Путин', received: 0, countries: ['Россия']},
    {name: 'Дима Лукашенко', received: 0, countries: ['Беларусь', 'Россия']},
    {name: 'Петя Порошенко', received: 0, countries: ['Украина', 'Италия']},
    {name: 'Степа Зеленский', received: 0, countries: ['Украина', 'Италия', 'Франция']},
    {name: 'Коля Назарбаев', received: 0, countries: ['Казахстан']},
    {name: 'Витя Берлузкони', received: 0, countries: ['Италия', 'Франция']},
    {name: 'Валера Кеннеди', received: 0, countries: []},
    {name: 'Виталя Черчилль', received: 0, countries: ['Италия', 'Россия']},
    {name: 'Зина Трамп', received: 0, countries: ['Туркменистан']},
    {name: 'Лида Обама', received: 0, countries: ['Узбекистан']},
    {name: 'Катя Меркель', received: 0, countries: ['Беларусь']},
    {name: 'Галя Горбачева', received: 0, countries: []},
];

let order = 0;
let maxDiff = 3;

$(function() {
    initContent();
    addLidsEvent($('#one-lead'), 1);
    addLidsEvent($('#ten-lead'), 10);
    addLidsEvent($('#hundred-lead'), 100);
});

function initContent() {

    countries.forEach(country => {
        $('#traffic-table tbody').append(`<tr><td>${country}</td><td>0</td></tr>`);
    });
    
    users.forEach(user => {
        $('#country-distribution').append(`
            <table border="1">
                <caption>${user.name}</caption>
                <thead>
                    <tr>
                        <th>Страна</th>
                        <th>Количество</th>
                    </tr>
                </thead>
                <tbody>
                    ${user.countries.map(country => `<tr class="selected"><td>${country}</td><td>0</td></tr>`).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Всего лидов получил</td>
                        <td class="summ">0</td>
                    </tr>
                </tfoot>
            </table>
        `);
    });
        
}

function addLidsEvent(el, count) {
    el.on('click', function() {
        for (let i = 0; i < count; i++) {
            let leadNumber = getLeadNumber();
            let counter = $(`#traffic-table tbody tr:eq(${leadNumber}) td + td`);
            counter.text(+counter.text() + 1);

            let summ = $('#traffic-table tfoot td + td');
            summ.text(+summ.text() + 1);

            maxDiff = $("input[type=text]").val();

            if ($("input[type=radio]:checked").val() === 'old') {
                oldTrafficAlgorithm(countries[leadNumber]);
            } else {
                newTrafficAlgorithm(countries[leadNumber]);
            }
        }
    });
}

function getLeadNumber() {
    return Math.floor(Math.random() * countries.length);
}

function oldTrafficAlgorithm(country) {
    let tBody = $(`#country-distribution table:eq(${order}) tbody`);
    let rows = tBody.find(`tr td:first-child:contains('${country}')`);
  
    if (rows.text()) {
        let counter = rows.next();
        counter.text(+counter.text() + 1);
    } else {
        tBody.append(`<tr><td>${country}</td><td>1</td></tr>`)
    }

    tBody.next().find('.summ').text(++users[order].received);
    order = ++order % users.length;
}

function newTrafficAlgorithm(country) {
    const indexArrOfUserSelectCountry = [];
    const indexArrOfMinReceived = [];
    let maxReceived = users[0].received;
    let minReceived = users[0].received;

    //Собираем все индексы ползователей, которые выбрали страну пришедшего лида
    users.forEach((user, index) => {

        if (user.countries.includes(country)) {
            indexArrOfUserSelectCountry.push(index);
        }

    });

    //Если нет таких пользователе, значит лид идет тем, у кого не выбраны страны
    if (!indexArrOfUserSelectCountry.length) {

        users.forEach((user, index) => {

            if (!user.countries.length) {
                indexArrOfUserSelectCountry.push(index);
            }

        });

    }

    //Ищем максимальную и минимальную цифру полученных лидов
    for (let i = 0; i < users.length; i++) {
        
        if (users[i].received > maxReceived) {
            maxReceived = users[i].received;
        } else if (users[i].received < minReceived) {
            minReceived = users[i].received;
        }

    }

    //Собираем в массив индексы пользователей с минимумом полученных лидов
    users.forEach((user, index) => {

        if (user.received === minReceived) {
            indexArrOfMinReceived.push(index);
        }

    });

    //Если разница больше или равно максимальной разницы в полученных лидах (maxDiff),
    //значит распределяем среди тех, кто получил меньше всего
    if (maxReceived - minReceived >= maxDiff) {
        //Ищем первое пересечение в массивах
        let intersectionIndex = intersection(indexArrOfUserSelectCountry, indexArrOfMinReceived);

        //Если среди минимумов есть индексы для стран, отдаем лида первому из стран
        if (intersectionIndex) {
            order = intersectionIndex;
        } else {
            //Если нет, отдаем первому среди минимумов
            order = indexArrOfMinReceived[0];
        }

    } else {
        //Если разница меньше 3, проверяем не пустой ли массив выбранных стран
        //Если не пустой, тогда в нем находим кандидата с минимальным количеством лидов и отдаем ему
        if (indexArrOfUserSelectCountry.length) {
            order = indexArrOfUserSelectCountry.reduce(
                (acc, curr) => users[acc].received <= users[curr].received ? acc : curr
            );
        } else {
            //Если пустой (все выбрали какую-то страну, но лид не подходит ни под одну из них)
            //Просто отдаем первому из тех, кто получил меньше всего лидов
            order = indexArrOfMinReceived[0];
        }

    }

    //Просто рендеринг через старый метод)
    oldTrafficAlgorithm(country);
}


function intersection(arr1, arr2) {
    let idx = 0;
   
    for (let i = 0; i < arr1.length; i++) {
        idx = arr2.indexOf(arr1[i]);

        if (idx !== -1) {
            return arr1[i];
        };
    }

    return false;
}
