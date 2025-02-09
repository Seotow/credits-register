let trainingModules = [];

// Default fetch
async function fetchData(url, method = "GET", body = null, customHeaders = {}) {
    const defaultHeaders = {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        referer: "https://sv.haui.edu.vn/register/",
    };

    const headers = { ...defaultHeaders, ...customHeaders };

    try {
        const response = await fetch(url, {
            method,
            headers,
            body,
            mode: "cors",
            credentials: "include",
            referrerPolicy: "strict-origin-when-cross-origin",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error;
    }
}

async function regist(independentClassID) {
    const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=addclass&v=${kverify}`;
    const body = `class=${independentClassID}`;

    try {
        const result = await fetchData(url, "POST", body);
        if (result.err == 1) {
            console.log(`Đăng ký không thành công lớp: ${independentClassID}`);
        } else {
            console.log(result);
        }
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function removeClass(independentClassID) {
    const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=removeclass&v=${kverify}`;
    const body = `class=${independentClassID}`;

    try {
        const result = await fetchData(url, "POST", body);
        console.log(result);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function autoRegistMultiClasses(classesArray) {
    
    for (let i = 0; i < classesArray.length; i++) {
        const classID = classesArray[i];
        try {
            const result = await regist(classID);
            if (result.err != 1) {
                classesArray.splice(i, 1);
                i--;
            }
        } catch (err) {
            console.log(err);
        }
    }
}

// Hàm bắt đầu auto đăng ký, tham số:
// - classesArray: mảng các independentClassID cần đăng ký
// - interval: thời gian lặp (mặc định 300ms)
function startAutoRegister(classesArray, interval = 300) {
    window.autoRegisterInterval = setInterval(() => {
        if (classesArray.length === 0) {
            console.log("Đã đăng ký hết các lớp!");
            clearInterval(window.autoRegisterInterval);
        } else {
            autoRegistMultiClasses(classesArray);
        }
    }, interval);
}

// Hàm dừng auto đăng ký
function removeAuto() {
    if (window.autoRegisterInterval) {
        clearInterval(window.autoRegisterInterval);
        console.log("Dừng đăng ký tự động");
    } else {
        console.log("Hiện không đăng ký tự động");
    }
}

// Sample
// startAutoRegister([225656, 221709, 225964, 225809]);

// // Dừng auto register
// removeAuto();

// Hàm xử lý để trích xuất thông tin trong khung chương trình
function extractModules(data) {
    const result = [];

    // Xử lý các module trong BatBuoc
    if (Array.isArray(data.BatBuoc)) {
        result.push(...data.BatBuoc.map(module => ({
            ModulesID: module.ModulesID,
            ModulesName: module.ModulesName
        })));
    }

    // Xử lý các module trong TuChon
    if (Array.isArray(data.TuChon)) {
        data.TuChon.forEach(group => {
            if (Array.isArray(group.ListModulesTC)) {
                result.push(...group.ListModulesTC.map(module => ({
                    ModulesID: module.ModulesID,
                    ModulesName: module.ModulesName
                })));
            }
        });
    }

    // Xử lý các module trong TuongDuong
    if (Array.isArray(data.TuongDuong)) {
        result.push(...data.TuongDuong.map(module => ({
            ModulesID: module.ModulesID,
            ModulesName: module.ModulesName
        })));
    }

    return result;
}

// Hàm lấy tất cả học phần trong khung chương trình
async function getTraning() {
    const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=tranning&v=${kverify}`;
    const data = await fetchData(url, "POST");
    const trainingData = data.data[0].ChuongTrinh1;
    // Lưu dữ liệu vào biến toàn cục
    trainingModules = extractModules(trainingData);
    return trainingModules;
}

getTraning()


// Hàm lấy fid của tất cả học phần đang mở
// async function getFids() {
//     let fids = []
//     let trainingData = await getTraning()
//     let trainingFids = trainingData.map(x => x.ModulesID)

//     for (let i of trainingFids) {
//         const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=classbymodulesid&v=${kverify}`;
//         const body = `fid=${i}`;

//         try {
//             const classesData = (await fetchData(url, "POST", body)).data;
//             if (classesData.length != 0) {
//                 fids.push(i);
//             }
//         } catch (err) {
//             console.log(err);
//             throw err;
//         }
//     }

//     return fids;
// }

// async function getClasses() {
//     let fids = await getFids()
//     let sections = [];
//     for (let fid of fids) {
//         const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=classbymodulesid&v=${kverify}`
//         const body = `fid=${fid}`

//         try {
//             const classesData = (await fetchData(url, "POST", body)).data;
//             sections.push({fid, classes: classesData});
//         } catch (err) {
//             console.log(err)
//             throw err;
//         }
//     }
//     //classs is class
//     sections
//         .forEach(({fid, classes}) => {
//             console.group(
//                 `%c${classes[0]?.ModulesName} - ${classes[0]?.ModulesCode} - fid: ${fid}`,
//                 "color: yellow; font-weight: bold;"
//             );
//             classes.forEach((classs) => {
//                 // Xử lý giờ học
//                 const listDate = classs?.ListDate ? JSON.parse(classs.ListDate) : "";
//                 // Map các giá trị DayStudy sang thứ trong tuần
//                 const dayMapping = {
//                     2: "Thứ 2",
//                     3: "Thứ 3",
//                     4: "Thứ 4",
//                     5: "Thứ 5",
//                     6: "Thứ 6",
//                     7: "Thứ 7",
//                     1: "Chủ nhật",
//                 };

//                 // Nhóm các StudyTime theo DayStudy
//                 const groupedData = listDate.reduce((acc, curr) => {
//                     const day =
//                         dayMapping[curr.DayStudy] || `Ngày ${curr.DayStudy}`;
//                     if (!acc[day]) {
//                         acc[day] = [];
//                     }
//                     acc[day].push(curr.StudyTime);
//                     return acc;
//                 }, {});

//                 // Chuyển dữ liệu sang thứ: tiết, thứ: tiết ...
//                 const date = Object.entries(groupedData)
//                     .map(([day, times]) => `${day}: ${times.join(" ")}`)
//                     .join(", ");

//                 // Hiển thị
//                 console.group(JSON.parse(classs.GiaoVien)[0]?.Fullname);
//                 console.log(
//                     `${classs.IndependentClassID} - ${classs.ClassName}`
//                 );
//                 console.log(date);
//                 console.log(`${classs.CountS}/${classs.MaxStudent}`);
//                 console.log(`${classs?.BranchName}`);
//                 console.groupEnd();
//             });
//             console.groupEnd();
//         });

//     return sections;
// }

let sampleClass = {
    IndependentClassID: 216243,
    ModulesName: "Lý thuyết đồ thị",
    ModulesCode: "IT6093",
    ClassCode: "20241IT6093001",
    ClassName: "IT6093.1",
    MaxStudent: 65,
    CountS: 7,
    Status: 1,
    IsLock: 0,
    GiaoVien: '[{"Fullname":"Lê Như Hiền"}]',
    Costs: 2115000,
    StartDate: "09/09/2024",
    ListDate:
        '[{"DayStudy":"2","StudyTime":7,"RoomName":"606","RoomID":2104},{"DayStudy":"2","StudyTime":8,"RoomName":"606","RoomID":2104},{"DayStudy":"2","StudyTime":9,"RoomName":"606","RoomID":2104}]',
    Credits: "3.0",
    BranchName: "Cơ sở 1 - Khu A",
    Description: "",
};
