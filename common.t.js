class Callbacks {
    constructor() {
        this.callbacks = [];
    }

    add(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
            return this.callbacks.length - 1; // return index of the callback
        }
    }

    remove(index) {
        if (index >= 0 && index < this.callbacks.length) {
            this.callbacks.splice(index, 1);
        }
    }

    clear() {
        this.callbacks = [];
    }

    run(...args) {
        this.callbacks.forEach(callback => callback(...args));
    }
}

var loadingContentCount = 0;

function loadContentWithoutTag(done = null) {
    $(".include").each(function() {
        if (!!$(this).attr("include")) {
            var $includeObj = $(this);
            $(this).load($(this).attr("include"), function(html) {
                $includeObj.after(html).remove(); // remove the include tag
                loadingContentCount--;
                if (loadingContentCount === 0) {
                    done?.();
                }
            });

            loadingContentCount++;
        }
    });
}

function startAllCarousels() {
    // Start all carousels
    $('.carousel').each(function(i, e) {
        bootstrap.Carousel.getOrCreateInstance(e)?.to(0);
    });
}

const app = Vue.createApp({
    data() {
        return {
            language: 'zh-tw',
            langChanged: new Callbacks(),
            searchQuery: '',
            yearFilter: 'all',
            nowPubPage: 1,
            currentMemberFilter: "全部",
            currentTime: new Date().toLocaleString(),
            window: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
            },
            info: {
                lab: {
                    university: {
                        name: '國立臺灣科技大學',
                        logo: 'assets/images/logo.png',
                        website: 'https://www.ntust.edu.tw',
                        address: '台北市大安區忠孝東路四段43號',
                        phone: '02-1234-5678',
                    },
                    college: {
                        name: '工學院',
                        website: 'https://www.ntust.edu.tw/college/engineering',
                    },
                    department: {
                        name: '化學工程系',
                        website: 'https://www.ntust.edu.tw/department/chemical-engineering',
                    },
                    name: '化工製程技術實驗室',
                    pi: {
                        name: '游承修',
                        title: '助理教授',
                        name_title: '游承修 助理教授',
                        company_department: '國立臺灣科技大學 化學工程系',
                        image: 'assets/images/pi.jpg',
                        description: '指導教授描述'
                    },
                    description: '致力於二氧化碳捕捉、熱物性質量測、相平衡模擬及製程強化的尖端研究',
                    members_order: ["碩一", "碩二", "碩零"],
                    members_all: "全部",
                    members: [
                        {
                            "name": "姓名",
                            "titles": ["碩一"],
                            "image": "assets/default/user.png",
                            "email": "for@example.com",
                            "email_edu": "lab@mail.edu.tw",
                            "research": "詳細研究領域",
                            "bio": ""
                        },
                    ]
                },
                nav: {
                    home: '首頁',
                    pi: '指導教授',
                    members: '成員',
                    research: '研究領域',
                    publications: '文獻發表',
                },
                home: {
                    introduction: {
                        carousel: [],
                        title: '實驗室簡介',
                        content: '國立臺灣科技大學化學工程所游承修教授的化工製程技術實驗室，專注於開發創新解決方案，應對當代化學工程的挑戰。我們的研究結合了實驗測量與理論模擬，以促進化工製程的效率、環保性及經濟效益。我們致力於培養學生在化學工程領域的專業知識和解決問題的能力，並與國內外學術界和產業界保持密切合作，共同推動相關領域的技術發展。'
                    }, 
                    // 公告欄
                    announcement: {
                        title: '公告欄',
                        content: '歡迎來到我們的實驗室網站！我們將定期更新最新消息和研究成果，敬請關注！'
                    }, 
                    // 活動花絮
                    activities: {
                        title: "活動花絮",
                        carousel: []
                    }
                },
                research: {
                    title: '研究領域',
                    equipment: {
                        title: '專業設備',
                        carousel: []
                    }
                },
                pi: {
                    bio: {
                        title: '主持教授',
                        education: {
                            title: '學歷',
                            list: []
                        },
                        work: {
                            title: '工作經歷',
                            list: []
                        },
                    }
                },
                publications: {
                    title: '文獻發表',
                    search: {
                        placeholder: '搜尋論文...'
                    },
                    filter: {
                        year: '年份',
                        all: '全部',
                    },
                    list: []
                }
            }
        }
    },


    methods: {
        changeLanguage(lang) {
            this.language = String(lang).toLowerCase();

            // parse assets/info_{lang}.json to this.info
            fetch(`/assets/info_${this.language}.json`)
                .then(response => response.json())
                .then(data => {
                    this.info = data;
                    this.langChanged.run(this.language);
                })
                .catch(error => console.error('Error loading JSON:', error));
        },
        breaklinableEmail(email) {
            return email.replace(/@/g, '<wbr>@').replace(/\./g, '<wbr>.');
        }
    }, 

    created() {
        // system language detection
        this.langChanged.add((lang) => {
            startAllCarousels();
        });

        const userLang = localStorage.getItem('lang') || navigator.language || navigator.userLanguage || this.language;
        this.changeLanguage(userLang);
        localStorage.setItem('lang', this.language);

        // change lang attribute in html tag
        document.documentElement.setAttribute('lang', this.language);

        window.onresize = () => {
            this.window.innerWidth = window.innerWidth;
            this.window.innerHeight = window.innerHeight;
        };

        setInterval(() => {
            this.currentTime = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
        }, 1000);
    },
    
});