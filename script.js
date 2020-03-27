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
    {name: 'Вася Путин', countries: ['Россия']},
    {name: 'Дима Лукашенко', countries: ['Беларусь', 'Россия']},
    {name: 'Петя Порошенко', countries: ['Украина', 'Италия']},
    {name: 'Степа Пермяков', countries: ['Украина', 'Италия', 'Франция']},
    {name: 'Коля Петросян', countries: ['Казахстан']},
    {name: 'Виктор Петров', countries: ['Беларусь', 'Узбекистан']},
    {name: 'Петр Степанов', countries: ['Италия', 'Россия']},
    {name: 'Зина Туркменистановна', countries: ['Туркменистан']},
    {name: 'Лида Терешкова', countries: ['Узбекистан']},
    {name: 'Катя Катит', countries: ['Беларусь']},
];




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

            let summ = $('#traffic-table tfoot tr td + td');
            summ.text(+summ.text() + 1);

            trafficAlgorithm(countries[leadNumber]);
        }
    });
}

function getLeadNumber() {
    return Math.floor(Math.random() * countries.length);
}

function trafficAlgorithm(country) {
    console.log(country);
}