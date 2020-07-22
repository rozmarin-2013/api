function calcCourses() {

    let formCourses = document.getElementById('courses1'),
        bynInput = formCourses.querySelector('input[name=byn]'),
        courseInput = formCourses.querySelector('input[name=currency_value]'),
        courseNameSelect = formCourses.querySelector('select[name=currency_name]');

    if (!formCourses || !bynInput || !courseNameSelect || !courseInput) {
        return;
    }

    bynInput.addEventListener('input', changeValueCourse, false);
    courseInput.addEventListener('input', changeValueCourse, false);
    courseNameSelect.addEventListener('change', changeNameCourse);

    let coursesNBRB = new CoursesNBRB(),
        defaultCourseCode = 840,
        curCode = defaultCourseCode;

    async function init() {
        try {
            let allCourses = await coursesNBRB.getAllCourses();

            allCourses.forEach(item => {
                let option = document.createElement('option');
                option.value = item.Cur_Code;
                option.innerHTML = item.Cur_Abbreviation;

                if (+item.Cur_Code === defaultCourseCode) {
                    option.setAttribute('selected', true);
                }

                courseNameSelect.append(option);
                courseInput.setAttribute('value', 1);
                courseInput.dispatchEvent(new Event('input'));
            });
        } catch (e) {
            formCourses.querySelector('.errors').innerHTML = 'По техническим причинам калькулятор валют не работает';
        }
    }

    async function changeValueCourse(event) {
        try {
            if (isNaN(Number(this.value))) {
                this.value = this.getAttribute('value');
                return false;
            }

            let valueInput = this.value;

            let result = await coursesNBRB.getCoursesBYN(curCode),
                curScale = result.Cur_Scale,
                rate = result.Cur_OfficialRate;

            if (this === bynInput) {
                courseInput.value = ((valueInput / rate) * curScale).toFixed(4);
            } else if (this === courseInput) {
                bynInput.value = ((valueInput * rate) * curScale).toFixed(4);
            }

            this.setAttribute('value', this.value);
        } catch (e) {
            formCourses.querySelector('.errors').innerHTML = `
                Для выбранной вами валюты, не установлен курс НБРБ
            `;
        }
    }

    function changeNameCourse() {
        curCode = this.value;
        bynInput.dispatchEvent(new Event('input'));
    }

    init();
}

window.addEventListener('load', calcCourses);