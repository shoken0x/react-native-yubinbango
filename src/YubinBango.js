import React, { Component } from 'react';
import { View, Text, TextInput } from "react-native";
import Select from './Select';

class YubinBango extends Component {
  URL = 'https://yubinbango.github.io/yubinbango-data/data';
  PREFECTURES = [
    { value: 1, label: "北海道" }, { value: 2, label: "青森県" }, { value: 3, label: "岩手県" },
    { value: 4, label: "宮城県" }, { value: 5, label: "秋田県" }, { value: 6, label: "山形県" },
    { value: 7, label: "福島県" }, { value: 8, label: "茨城県" }, { value: 9, label: "栃木県" },
    { value: 10, label: "群馬県" }, { value: 11, label: "埼玉県" }, { value: 12, label: "千葉県" },
    { value: 13, label: "東京都" }, { value: 14, label: "神奈川県" }, { value: 15, label: "新潟県" },
    { value: 16, label: "富山県" }, { value: 17, label: "石川県" }, { value: 18, label: "福井県" },
    { value: 19, label: "山梨県" }, { value: 20, label: "長野県" }, { value: 21, label: "岐阜県" },
    { value: 22, label: "静岡県" }, { value: 23, label: "愛知県" }, { value: 24, label: "三重県" },
    { value: 25, label: "滋賀県" }, { value: 26, label: "京都府" }, { value: 27, label: "大阪府" },
    { value: 28, label: "兵庫県" }, { value: 29, label: "奈良県" }, { value: 30, label: "和歌山県" },
    { value: 31, label: "鳥取県" }, { value: 32, label: "島根県" }, { value: 33, label: "岡山県" },
    { value: 34, label: "広島県" }, { value: 35, label: "山口県" }, { value: 36, label: "徳島県" },
    { value: 37, label: "香川県" }, { value: 38, label: "愛媛県" }, { value: 39, label: "高知県" },
    { value: 40, label: "福岡県" }, { value: 41, label: "佐賀県" }, { value: 42, label: "長崎県" },
    { value: 43, label: "熊本県" }, { value: 44, label: "大分県" }, { value: 45, label: "宮崎県" },
    { value: 46, label: "鹿児島県" }, { value: 47, label: "沖縄県" }
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      inputValue: null,
      result: null,
      region: null,
      locality: null,
      street: null,
      extended: null,
      selectedPrefecutre: null
    };
  }

  _fetch = (url, yubin7) => {
    fetch(url)
      .then((response) => response.text())
      .then((text) => this._setAddr(text, yubin7))
      .catch((error) => console.error(error));
  }

  _setAddr = (text, yubin7) => {
    const matcher = text.match(/({".*"]})/);
    if (matcher) {
      const json = JSON.parse(matcher[0]);
      const addr = json[yubin7];
      if (addr && addr[0] && addr[1]) {
        const index = addr[0] - 1;
        this.setState({ region_id: addr[0],
                        region: this.PREFECTURES[index]["label"],
                        locality: addr[1],
                        street: addr[2],
                        extended: addr[3]
        });
        this._setSelectedPrefecture(index);
      }
    }
  }

  _getAddr = yubin7 => {
    const yubin3 = yubin7.substr(0, 3);
    this._fetch(`${this.URL}/${yubin3}.js`, yubin7);
  }

  _chk7(val) {
    if (val.length === 7) {
      return val;
    }
  }

  _handleTextChange = inputValue => {
    this.setState({ inputValue },()=> {
      if (inputValue) {
        const a = inputValue.replace(/[０-９]/g, (s: string) => String.fromCharCode(s.charCodeAt(0) - 65248));
        const b = a.match(/\d/g);
        const c = b.join('');
        const yubin7 = this._chk7(c);
        if (yubin7) {
          this._getAddr(this.state.inputValue);
        }
      }
    });
  }

  _setSelectedPrefecture = index => {
    this.setState({ selectedPrefecture: index });
  }

  render() {
    return (
      <View>
        <Text>郵便番号を入力してください</Text>
        <TextInput
          keyboardType="number-pad"
          onChangeText={this._handleTextChange}
          style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
        />
        <Select
          label="prefecture"
          name="prefecture"
          options={this.PREFECTURES}
          value={this.state.selectedPrefecture}
          setFieldValue={index => this._setSelectedPrefecture(index)}
        />
        <TextInput
          editable={false}
          value={this.state.region}
          style={{ height: 40, width: 100 }}
        />
        <TextInput
          editable={false}
          value={this.state.locality}
          style={{ height: 40, width: 100 }}
        />
        <TextInput
          editable={false}
          value={this.state.street}
          style={{ height: 40, width: 100 }}
        />
        <TextInput
          editable={false}
          value={this.state.extended}
          style={{ height: 40, width: 100 }}
        />
      </View>
    );
  }
}

export default YubinBango;
