class CoursesNBRB {
    URL_ALL_COURSES = 'https://www.nbrb.by/api/exrates/currencies';
    URL_COURSE_BYN = 'https://www.nbrb.by/api/exrates/rates/';

    async getAllCourses() {

        return this.request(this.URL_ALL_COURSES, []);
    }

    async getCoursesBYN(curCode) {

        return this.request(this.URL_COURSE_BYN + curCode, {'parammode': 1});
    }

    async request(url, paramsGet) {
        let urlRequest = url,
            params = '';

        if (paramsGet) {
            let index = 0;
            for (let key in paramsGet) {
                if (index === 0) {
                    params += '?';
                } else {
                    params += '&';
                }
                params += `${key}=${paramsGet[key]}`;
                index++;
            }

            urlRequest = url + params;
        }

        let result = await fetch(urlRequest);

        if (!result.ok) {
            throw new Error('HTTP: ' + result.status);
        }

        return await result.json();
    }
}