const App = {
  data() {
    return {
      //ここにデータを宣言する
      appTitle: "MEIGEN",
      appIconPath: "/512.png",
      isFirstTime: true, //初回起動かどうか
      testData: "",
      testArray: [1, 2, 3, 4],
      fetchNum: 3,
      dataList: {},
      isDataLoading: false,
    }
  },
  // dataの更新を受け処理をした結果を返す(引数使用不可)
  computed: {
    getTimerSecondValue: function () {
      return "computed_" + this.testData;
    },
  },
  //通常の関数のような処理
  methods: {
    loadInitialData() {
      if (localStorage.getItem("visited") !== null)
        this.isFirstTime = false;
    },
    test(arg1, arg2) {
      return arg1 + arg2;
    },
    fetchMeigen() {
      this.isDataLoading = true;
      //以下非同期処理でURLアクセス
      axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://meigen.doodlenote.net/api/json.php?c=' + this.fetchNum)
      ).then(response => {//取得成功したら
        this.dataList = JSON.parse(response.data.contents);
      }).catch(error => {
        console.error("Error:", error);
      }).finally(() => {
        this.isDataLoading = false;
      });
    }
  },
  //data内の変数を監視し変化した場合に呼ばれる処理を記述可能
  watch: {
    testData(newVal, oldVal) {
      //ここでなにか処理
    },
    testArray: {
      handler(newVal, oldVal) {
        //ここでなにか処理
      },
      deep: true //配列要素の監視時に必要
    },
  },

  //ライフサイクルフック
  mounted() {
    this.loadInitialData();
    //初回訪問時とそれ以外で分岐処理
    if (this.isFirstTime) {
      localStorage.setItem("visited", "1");
      document.getElementById("help").classList.add("active");
      document.querySelectorAll('a[data-ui="#help"]').forEach((el) => el.classList.add("active"));
    }
    else {
      document.getElementById("home").classList.add("active");
      document.querySelectorAll('a[data-ui="#home"]').forEach((el) => el.classList.add("active"));
    }

    this.fetchMeigen();
  },
};

const app = Vue.createApp(App);
app.mount("#app");
