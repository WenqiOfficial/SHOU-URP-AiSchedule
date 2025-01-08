function scheduleHtmlParser(json_str) {
  courses_json = JSON.parse(json_str);
  let allCourseInfo = [];

  // 遍历所有课程
  courses_json.forEach(function (courses) {
    const courseTeacher = courses.attendClassTeacher;
    // 遍历课程所有上课时间安排
    courses.timeAndPlaceList.forEach(function (content) {
      let courseObj = {
        'name': content.coureName,
        'position': content.campusName + content.teachingBuildingName + content.classroomName,
        'teacher': courseTeacher,
        'weeks': [],
        'day': content.classDay,
        'sections': []
      };

      // 处理上课周期
      const courseWeekOri = content.classWeek.slice();
      for (let i = 1; i <= content.classWeek.length; i++) {
        if (courseWeekOri[i - 1] === '1') courseObj.weeks.push(i);
      }

      // 处理上课时间段
      const startSections = content.classSessions,
        continuingSections = content.continuingSession;
      for (let i = 0; i <= continuingSections - 1; i++) {
        courseObj.sections.push(startSections + i);
      }

      allCourseInfo.push(courseObj);

    });

  });

  // console.log(allCourseInfo);
  return allCourseInfo;
}