/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer({ providerRes, parserRes } = {}) {
  await loadTool('AIScheduleTools');
  try {
    // 获取课程时间信息
    const res = await fetch("https://urp.shou.edu.cn/ajax/getSectionAndTime", {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://urp.shou.edu.cn/student/courseSelect/thisSemesterCurriculum/index",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "planNumber=&ff=f",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });

    const ret = await res.json();
    const sectionInfos = ret.section,
      sectionTime = ret.sectionTime;

    let timer = {
      totalWeek: 20,
      startSemester: '',
      startWithSunday: false,
      showWeekend: false,
      forenoon: sectionInfos.swjc,
      afternoon: sectionInfos.xwjc,
      night: sectionInfos.wsjc,
      sections: [],
    };

    // 计算学期总周数
    let sectionWeeksOri = sectionInfos.zc.slice(),
      weekCounter = 0;
    for (let i = 1; i <= sectionInfos.zc.length; i++) {
      if (sectionWeeksOri[i - 1] === '1') weekCounter++;
    }
    timer.totalWeek = weekCounter;

    // 遍历判断是否存在周末课程
    for (const course of parserRes) {
      if (course.day >= 6) {
        timer.showWeekend = true;
        break;
      }
    }

    // 遍历时间表
    sectionTime.forEach(function (section, index) {
      // 处理时间格式
      function convertTime(time) {
        let [hours, minutes] = time.match(/(\d{2})(\d{2})/).slice(1, 3);
        hours = parseInt(hours, 10);
        if (index + 1 > sectionInfos.swjc && hours < 12) {
          hours += 12;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      }

      const formattedStartTime = convertTime(section.startTime);
      const formattedEndTime = convertTime(section.endTime);

      let sectionObj = {
        'section': section.id.session,
        'startTime': formattedStartTime,
        'endTime': formattedEndTime
      };

      timer.sections.push(sectionObj);
    });

    return timer;
    // PS: 夏令时什么的还是让用户在夏令时的时候重新导入一遍吧，在这个函数里边适配吧！奥里给！————不愿意透露姓名的嘤某人
    // 附：支持捏！

  } catch (error) {
    await AIScheduleAlert('未知错误，请确定你已经登录URP');
    return 'do not continue';
  }
}