<template>
    <el-card>
        <el-button type="primary" @click="startAdd">新增</el-button>
        <el-button type="primary" @click="goTask">定时任务</el-button>
        <el-button plain class="mBottom16 fr" @click="getItemList">刷新</el-button>
        <el-table border stripe size="small" :data="tableList" class="w100"  highlight-current-row>
            <el-table-column prop="loginId" label='OA账号' align="center" width="80"></el-table-column>
            <el-table-column prop="password" label="OA密码" align="center" width="80"></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" width="100"></el-table-column>
            <el-table-column prop="enable" label='打卡状态' align="center" width="110">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.enable === 0 ? 'danger' : 'success'"
                        disable-transitions>{{scope.row.enable===0?'停用':'启用'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="clientType" label="操作系统" align="center" width="120">
                <template slot-scope="scope">
                    <el-tag type='info' disable-transitions>{{scope.row.clientType===2?'苹果':'安卓'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="osVersion" label="系统版本" align="center" width="80"></el-table-column>
            <el-table-column prop="clientModel" label='手机型号' align="center" width="80"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称" align="center" width="80"></el-table-column>
            <el-table-column prop="deviceId" width="250" label="设备ID" align="center"></el-table-column>
            <el-table-column prop="loginUUID" width="250" label="登陆UUID" align="center"></el-table-column>
            <el-table-column prop="pushId" width="250" label="推送ID" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="info" size="small" @click="upd(scope.row)">修改</el-button>
                    <el-button type="success" size="small" v-show="!scope.row.enable" @click="change(scope.row.loginId,1)">启用打卡</el-button>
                    <el-button type="danger" size="small" v-show="scope.row.enable" @click="change(scope.row.loginId,0)">停用打卡</el-button>
                    <el-button type="primary" size="small" @click="bindPush(scope.row)">绑定推送</el-button>
                    <el-button type="warning" size="small" @click="punch(scope.row)">打卡</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="40%">
            <el-form :model="item" label-width="100px">
                <el-row>
                    <el-col :sm="12">
                        <el-form-item label="操作系统">
                            <el-select v-model="item.clientType" style="width: 100%" size="medium">
                                <el-option :value='2' label="苹果"></el-option>
                                <el-option :value='3' label="安卓"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="手机型号">
                            <el-input v-model="item.clientModel" clearable size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="OA账户">
                            <el-input v-model="item.loginId" clearable size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="设备ID">
                            <el-input v-model="item.deviceId" clearable size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="登录UUID" v-show="item.clientType==='3'">
                            <el-input v-model="item.loginUUID" clearable size="medium"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="12">
                        <el-form-item label="系统版本">
                            <el-input v-model="item.osVersion" clearable size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="设备名称">
                            <el-input v-model="item.deviceName" clearable size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="OA密码">
                            <el-input v-model="item.password" clearable size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码">
                            <el-input type="text" v-model="item.captchaText" maxlength="4" placeholder="验证码"
                                      style='width: 62%;float: left;height:36px' clearable size="medium"></el-input>
                            <img style="float: left;width:36%;height: 40px;cursor: pointer;margin-left: 2%;border-radius: 4px;"
                                 @click="changeCaptcha" :src="captchaImg"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogConfirm">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="绑定推送" :visible.sync="qrcodeVisible" width="50%">
            <div id="qrcode"></div>
            <br><br>
            <p class="center" style="font-size: 18px">请先扫码关注，再点击
                <el-button type="text" style="font-size: 18px" @click="startSearch">查询</el-button>
            </p>
            <el-table border size="small" :data="pushIdList" class="w100"  highlight-current-row>
                <el-table-column type="index" width="50" label='序号' align="center"></el-table-column>
                <el-table-column label='头像' align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.headImg" width="40" height="40" />
                    </template>
                </el-table-column>
                <el-table-column prop="nickName" :show-overflow-tooltip="true" label="昵称" align="center"></el-table-column>
                <el-table-column prop="pushId" :show-overflow-tooltip="true" label="推送ID" align="center"></el-table-column>
                <el-table-column align="center" label="操作" width="130">
                    <template slot-scope="scope">
                        <el-button type="text primary" size="small" @click="updPushId(scope.row)">保存</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-card>
</template>

<script>
import QRCode from 'qrcodejs2';
class Item{
    constructor(){
        this.clientType = null;
        this.loginUUID = null;
        this.clientModel = null;
        this.deviceId = null;
        this.deviceName = null;
        this.loginId = null;
        this.mobile = null;
        this.osVersion = null;
        this.password = null;
        this.key = null;
        this.captchaText = null;
    }
    reset(){
        this.constructor();
    }
}
export default {
    data() {
        return {
            tableList:[],
            dialogVisible:false,
            item: new Item(),
            title: null,
            captchaImg:null,
            qrcodeVisible:false,
            pushIdList:[],
            loginId:null
        };
    },
    created() {
        this.getItemList();
    },
    methods: {
        goTask(){
            this.$router.push('task');
        },
        async getItemList(){
            let res = await this.$http.post('/oa/getUserList',{});
            if(res.state){
                this.tableList = res.data;
            }
        },
        async dialogConfirm(){
            let url = '/oa/addUser';
            if(this.title === '修改'){
                url = '/oa/updUser';
            }
            let res = await this.$http.post(url,this.item);
            if(res.state){
                this.$message.success('操作成功');
                this.dialogVisible = false;
                this.getItemList();
            }
        },
        startAdd(){
            this.item.reset();
            this.title = '新增';
            this.changeCaptcha();
            this.dialogVisible = true;
        },
        upd(row){
            this.item.reset();
            Object.assign(this.item,row);
            this.title = '修改';
            this.changeCaptcha();
            this.dialogVisible = true;
        },
        changeCaptcha() {
            this.item.key = new Date().getTime();
            this.captchaImg = 'http://115.238.110.210:8998/emp/captcha?key=' + new Date().getTime();
        },
        async change(loginId,state){
            let param = {
                loginId:loginId,
                enable:state
            };
            let res = await this.$http.post('/oa/updStatus',param);
            if(res.state){
                this.$message.success('操作成功');
                await this.getItemList();
            }
        },
        async updPushId(row){
            let param = {
                loginId:this.loginId,
                pushId:row.pushId
            };
            let res = await this.$http.post('/oa/bindPush',param);
            if(res.state){
                this.$message.success('操作成功');
                await this.getItemList();
                this.qrcodeVisible = false;
            }
        },
        bindPush(row){
            this.qrcodeVisible = true;
            this.qrCode();
            this.loginId = row.loginId;
        },
        async startSearch(row){
            let res = await this.$http.post('/oa/getPusherList',{});
            if(res.state){
                this.pushIdList = res.data;
            }
        },
        qrCode() {
            this.$nextTick( ()=> {
                document.getElementById('qrcode').innerHTML = '';
                let qrcode = new QRCode('qrcode', {
                    width: 150,
                    height: 150,
                    text: 'http://wxpusher.zjiecode.com/api/qrcode/n1GTiA1A7dnQB3oDLI80uxbctu3ZPecFw0mMa6rmuzowN3KGsyAmBxVsOxUXrTFt.jpg',
                });
            });
        },
        async punch(row){
            let res = await this.$http.post('/oa/punch',{loginId:row.loginId});
            if(res.state){
                this.$message.success(res.msg);
            }
        }
    }
};
</script>

<style scoped>
    #qrcode{
        position: relative;
        left: 50%;
        margin-left: -75px;
    }
</style>
