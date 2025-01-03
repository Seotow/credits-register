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
    const body = `class=${independentClassID}`

    try {
        const result = await fetchData(url, "POST", body);
        console.log(result);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function removeClass(independentClassID) {
    const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=removeclass&v=${kverify}`;
    const body = `class=${independentClassID}`

    try {
        const result = await fetchData(url, "POST", body);
        console.log(result);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

let autoRegisterInterval;
async function autoRegistMultiClasses(fid, independentIdList) {
    const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=classbymodulesid&v=${kverify}`;
    const body = `fid=${fid}`;
    try {
        const classesData = (await fetchData(url, "POST", body)).data;
        for (let i = 0; i < classesData.length; i++) {
            let classData = classesData[i];
            let condition = independentIdList.length === 0 || independentIdList.includes(classData.IndependentClassID);
            if (condition) {
                if (classData.CountS == classData.MaxStudent) {
                    console.log("Lớp đầy");
                    console.log(classData.CountS);
                } else {
                    try {
                        regist(classData.IndependentClassID);
                    } catch (err) {
                        console.log(err);
                        throw err;
                    }

                    clearInterval(window.autoRegisterInterval); // Dừng auto register
                }
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
}

function startAutoRegister(fid, independentIdList, interval = 100) {
    window.autoRegisterInterval = setInterval(() => autoRegistMultiClasses(fid, independentIdList), interval);
}

function removeAuto() {
    if (window.autoRegisterInterval) {
        clearInterval(window.autoRegisterInterval);
        console.log("Dừng đăng ký tự động");
    } else {
        console.log("Hiện không đăng ký tự động");
    }
}

// Sample
// startAutoRegister(4794, [214812], 100);

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
    const trainingData = data.data[0].ChuongTrinh1
    return extractModules(trainingData);
}


// Hàm lấy fid của tất cả học phần đang mở
async function getFids() {
    let fids = []
    let trainingData = await getTraning()
    let trainingFids = trainingData.map(x => x.ModulesID)

    for (let i of trainingFids) {
        const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=classbymodulesid&v=${kverify}`;
        const body = `fid=${i}`;

        try {
            const classesData = (await fetchData(url, "POST", body)).data;
            if (classesData.length != 0) {
                fids.push(i);
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    return fids;
}

// Mẫu fids kì phụ 1 (xuân) 2024
let fids = [
    4091, 4286, 4434, 4533, 4680, 4717, 4720, 4724, 4727, 4729, 4731, 4732,
    4735, 4737, 4738, 4739, 4740, 4742, 4746, 4755, 4757, 4758, 4759, 4760,
    4761, 4762, 4766, 4770, 4772, 4776, 4777, 4778, 4779, 4781, 4792, 4794,
    4795, 4799, 4802, 4803, 4804, 4805, 4809, 4810, 4811, 4812, 4813, 4814,
    4827, 4828, 4829, 4830, 4832, 4833, 4834, 4837, 4838, 4843, 4871, 4873,
    4882, 4924, 4925, 4926, 4927, 4928, 4929, 4930, 4931, 4932, 4933, 4934,
    4957, 5648, 5697, 5719, 5766, 5793, 5802, 5820, 5821, 5827, 5851, 5852,
    5876, 5882, 5883, 5885, 5886, 5898, 5899, 5900, 5907, 5921, 5930, 5946,
    5947, 5948, 5999, 6000, 6001, 6016, 6093, 6094, 6101, 6109, 6111, 6114,
    6117, 6132, 6136, 6138, 6139, 6140, 6142, 6144, 6151, 6154, 6160, 6161,
    6163, 6168, 6171, 6172, 6183, 6188, 6191, 6208, 6212, 6228, 6231, 6244,
    6252, 6253, 6266, 6267, 6269, 6273, 6275, 6276, 6277, 6278, 6279, 6285,
    6286, 6287, 6288, 6291, 6292, 6297, 6298, 6299, 6303, 6305, 6307, 6308,
    6309, 6310, 6311, 6312, 6320, 6321, 6322, 6323, 6326, 6327, 6328, 6329,
    6331, 6332, 6333, 6334, 6335, 6336, 6391, 6397, 6417, 6418, 6422, 6425,
    6430, 6432, 6436, 6441, 6445, 6446, 6551, 6552, 6553, 6554, 6706, 6743,
    6757, 6766, 6777, 6792, 6805, 6817, 6818, 6819, 6820, 6821, 6822, 6826,
    6827, 6828, 6837, 7046, 7047, 7048, 7050, 7051, 7052, 7061, 7062, 7063,
    7080, 7083, 7091, 7095, 7119, 7145, 7148, 7149, 7150, 7154, 7166, 7201,
    7202, 7205, 7206, 7207, 7214, 7235, 7254, 7271, 7333, 7341, 7397, 7422,
    7424, 7428, 7440, 7445, 7469, 7527, 7528, 7529, 7584, 7602, 7619, 7687,
    7688, 7776, 7852, 7857, 7858, 7869, 7871, 7881, 7897, 7971, 7974, 7976,
    7978, 7980, 7981, 7982, 7983, 7986, 7987, 7988, 7989, 7991, 7994, 7998,
    7999, 8001, 8014, 8015, 8017, 8018, 8019, 8023, 8025, 8030, 8031, 8033,
    8041, 8044, 8048, 8050, 8052, 8054, 8057, 8058, 8066, 8067, 8070, 8071,
    8072, 8073, 8074, 8075, 8079, 8080, 8081, 8082, 8083, 8084, 8087, 8089,
    8102, 8103, 8104, 8105, 8106, 8107, 8108, 8109, 8111, 8117, 8127, 8132,
    8134, 8135, 8136, 8137, 8141, 8143, 8146, 8147, 8149, 8160, 8161, 8162,
    8163, 8165, 8166, 8169, 8170, 8171, 8175, 8177, 8185, 8193, 8195, 8196,
    8197, 8198, 8201, 8204, 8214, 8215, 8216, 8217, 8218, 8222, 8226, 8227,
    8230, 8231, 8233, 8236, 8237, 8239, 8242, 8243, 8244, 8245, 8246, 8248,
    8251, 8253, 8255, 8258, 8266, 8267, 8268, 8269, 8270, 8271, 8272, 8274,
    8286, 8287, 8288, 8289, 8291, 8292, 8293, 8297, 8303, 8591, 8596, 8611,
    8613, 8624, 8637, 8638, 8639, 8653, 8718, 8840, 8889, 8952, 9427, 9431,
    9446, 9448, 9546, 9547, 9549, 9564, 9565,
];

async function getClasses() {
    let fids = await getFids()
    let sections = [];
    for (let fid of fids) {
        const url = `https://sv.haui.edu.vn/ajax/register/action.htm?cmd=classbymodulesid&v=${kverify}`
        const body = `fid=${fid}`

        try {
            const classesData = (await fetchData(url, "POST", body)).data;
            sections.push({fid, classes: classesData});
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    //classs is class
    sections
        .forEach(({fid, classes}) => {
            console.group(
                `%c${classes[0]?.ModulesName} - ${classes[0]?.ModulesCode} - fid: ${fid}`,
                "color: yellow; font-weight: bold;"
            );
            classes.forEach((classs) => {
                // Xử lý giờ học
                const listDate = classs?.ListDate ? JSON.parse(classs.ListDate) : "";
                // Map các giá trị DayStudy sang thứ trong tuần
                const dayMapping = {
                    2: "Thứ 2",
                    3: "Thứ 3",
                    4: "Thứ 4",
                    5: "Thứ 5",
                    6: "Thứ 6",
                    7: "Thứ 7",
                    1: "Chủ nhật",
                };

                // Nhóm các StudyTime theo DayStudy
                const groupedData = listDate.reduce((acc, curr) => {
                    const day =
                        dayMapping[curr.DayStudy] || `Ngày ${curr.DayStudy}`;
                    if (!acc[day]) {
                        acc[day] = [];
                    }
                    acc[day].push(curr.StudyTime);
                    return acc;
                }, {});

                // Chuyển dữ liệu sang thứ: tiết, thứ: tiết ...
                const date = Object.entries(groupedData)
                    .map(([day, times]) => `${day}: ${times.join(" ")}`)
                    .join(", ");

                // Hiển thị
                console.group(JSON.parse(classs.GiaoVien)[0]?.Fullname);
                console.log(
                    `${classs.IndependentClassID} - ${classs.ClassName}`
                );
                console.log(date);
                console.log(`${classs.CountS}/${classs.MaxStudent}`);
                console.log(`${classs?.BranchName}`);
                console.groupEnd();
            });
            console.groupEnd();
        });

    return sections;
}

getClasses()

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
