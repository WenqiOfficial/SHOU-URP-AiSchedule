async function scheduleHtmlProvider() {
  await loadTool('AIScheduleTools');
  try {
    // 获取url中的动态字段
    var scripts = document.querySelectorAll("script");// 获取所有 <script> 标签
    var dynamicField = 0;
    // 遍历所有 <script> 标签内容
    scripts.forEach(function (script) {
      var scriptContent = script.innerHTML;
      // 正则匹配 URL 中的动态字段
      var regex = /\/student\/courseSelect\/thisSemesterCurriculum\/([\w-]+)\/ajaxStudentSchedule\/curr\/callback/;
      var match = scriptContent.match(regex);
      if (match) {
        dynamicField = match[1]; // 提取动态字段的值
      }
    });

    if (dynamicField === 0) {
      await AIScheduleAlert('动态字段匹配失败，请进入到“本学期课表”页面');
    }

    // 获取当前学期课程
    const res = await fetch(`https://urp.shou.edu.cn/student/courseSelect/thisSemesterCurriculum/${dynamicField}/ajaxStudentSchedule/curr/callback`, {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://urp.shou.edu.cn/student/courseSelect/thisSemesterCurriculum/index",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });

    const ret = await res.json();
    const courseList = ret.dateList[0].selectCourseList;
    return JSON.stringify(courseList);

  } catch (error) {
    await AIScheduleAlert('未知错误，请确定你已经登录URP');
    return 'do not continue';
  }
}
