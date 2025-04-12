const App = {
  data() {
    return {
      //ここにデータを宣言する
      appTitle: "MEIGEN",
      appIconPath: "512.png",
      isFirstTime: true, //初回起動かどうか
      testData: "",
      testArray: [1, 2, 3, 4],
      isInitialFetch: false,
      fetchNum: 5,
      dataList: {},
      isDataLoading: false,
      isLoadFailed: false,

      selectedDict: "0",
      selectedAuther: "",
      selectedMeigen: "",
      dictData: [
        [],
        [],
        [],
        [],
      ],
    }
  },
  // dataの更新を受け処理をした結果を返す(引数使用不可)
  computed: {
    getTimerSecondValue: function () {
      return "computed_" + this.testData;
    },
  },
  // 通常の関数のような処理
  methods: {
    loadInitialData() {
      let loadValue;
      // 訪問済フラグを取得
      if (localStorage.getItem("visited") !== null)
        this.isFirstTime = false;
      // 名言取得数をロード
      loadValue = localStorage.getItem("fetchNum");
      if (loadValue !== null)
        this.fetchNum = parseInt(loadValue);
      // 起動時取得の有無をロード
      if (localStorage.getItem("initialFetch") !== null)
        this.isInitialFetch = true;
      // 保存済辞書をロード
      for (let dict_num = 0; dict_num < this.dictData.length; dict_num++) {
        let loadValue = localStorage.getItem("dict" + String(dict_num));
        if (loadValue !== null)
          this.dictData[dict_num] = JSON.parse(loadValue);
      }
    },

    saveDictData(dict_num) {
      localStorage.setItem("dict" + String(dict_num), JSON.stringify(this.dictData[dict_num]));
    },

    test(arg1, arg2) {
      return arg1 + arg2;
    },
    fetchMeigen() {
      this.isLoadFailed = false;
      this.isDataLoading = true;
      //以下非同期処理でURLアクセス(GETパラメータにタイムスタンプを付加し同URLへのブラウザキャッシュが効かないようにしている)
      axios.get('https://api.allorigins.win/get?url=' +
        encodeURIComponent('https://meigen.doodlenote.net/api/json.php?c=' + this.fetchNum + '&timestamp=' + new Date().getTime())
      ).then(response => {//取得成功したら
        this.dataList = JSON.parse(response.data.contents);
      }).catch(error => {
        this.isLoadFailed = true;
        ui("#load-failed-dialog");
        // console.error("Error:", error);
      }).finally(() => {
        this.isDataLoading = false;
      });
    },
    fetchMeigenD() {
      this.isLoadFailed = false;
      this.isDataLoading = true;
      this.dataList = JSON.parse('[{"meigen":"真の友は共に孤独である。","auther":"ボナール"},{"meigen":"解決策が分らないのではない。問題が分っていないのだ","auther":"チェスタートン"},{"meigen":"心の奥底に達してあらゆる病を癒せる音楽、それは暖かい言葉だ。","auther":"エマーソン"},{"meigen":"平等主義者は彼ら自身の水準まで他人を引き上げることを望むが、彼ら自身以上に引き上げようとはしない。","auther":"サミュエル＝ジョンソン"},{"meigen":"生きる勇気を持たないものは、戦う前に消えていく","auther":"浦沢直樹、勝鹿北星(漫画家) 出典:MASTERキートン キャラクタ:平賀・キートン・太一 [漫画・アニメの名言]"}]');
      this.isDataLoading = false;
    },
    recordDict(dict_num, meigen, auther) {
      dict_num = parseInt(dict_num);
      this.dictData[dict_num].push({ "meigen": meigen, "auther": auther });
      this.saveDictData(dict_num);
      ui("#recorded-snackbar");
      this.selectedDict = "0";
    },
    deleteDictItem(dict_num, index) {
      this.dictData[dict_num].splice(index, 1);
      this.saveDictData(dict_num);
    }
  },
  //data内の変数を監視し変化した場合に呼ばれる処理を記述可能
  watch: {
    fetchNum(newVal, oldVal) {
      localStorage.setItem("fetchNum", String(newVal));
    },
    isInitialFetch(newVal, oldVal) {
      if (newVal)
        localStorage.setItem("initialFetch", "1");
      else
        localStorage.removeItem("initialFetch");
    },
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
    if (this.isInitialFetch)
      this.fetchMeigen();
  },
};

const app = Vue.createApp(App);
app.mount("#app");
