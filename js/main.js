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
    },
    fetchMeigenD() {
      this.isDataLoading = true;
      this.dataList = JSON.parse('[{"meigen":"真の友は共に孤独である。","auther":"ボナール"},{"meigen":"解決策が分らないのではない。問題が分っていないのだ","auther":"チェスタートン"},{"meigen":"心の奥底に達してあらゆる病を癒せる音楽、それは暖かい言葉だ。","auther":"エマーソン"},{"meigen":"平等主義者は彼ら自身の水準まで他人を引き上げることを望むが、彼ら自身以上に引き上げようとはしない。","auther":"サミュエル＝ジョンソン"},{"meigen":"生きる勇気を持たないものは、戦う前に消えていく","auther":"浦沢直樹、勝鹿北星(漫画家) 出典:MASTERキートン キャラクタ:平賀・キートン・太一 [漫画・アニメの名言]"}]');
      this.isDataLoading = false;
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

    // this.fetchMeigen(); //本番用コード
    this.fetchMeigenD(); //デバッグ用コード
  },
};

const app = Vue.createApp(App);
app.mount("#app");
