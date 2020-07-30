<template>
    <div class="main">
        <el-card class="login-box" v-if="isLogin">
            <el-form label-width="88px">
                <el-form-item :rules="[{ required: true, message: '请填写OA用户名' }]" label="OA用户名">
                    <input class="input" type="text" v-model="loginId" placeholder="请填写OA用户名">
                </el-form-item>
            </el-form>
            <div class="login-btn" @click="login">
                登 录
            </div>
        </el-card>
        <el-card class="login-box center" v-else>
            <div v-show="0">{{sign}}</div>
            <p>OA账号：{{this.loginId}}</p><br>
            <p>打卡状态：{{user.enable|getName}}</p>
            <div class="btn" @click="changeState(1)" v-show="!user.enable">启用</div>
            <div class="btn" @click="changeState(0)" v-show="user.enable">停用</div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isLogin:true,
            flag:false,
            loginId:'',
            user:{},
            sign:0
        };
    },
    filters: {
        getName: (value) => {
            if (value === 1) {
                return '已启用';
            } else if (value === 0) {
                return '已停用';
            }
        }
    },
    created() {

    },
    methods: {
        async login(){
            let res = await this.$http.post('/sys/userLogin',{loginId:this.loginId});
            if(res.state){
                this.$message.success('登陆成功');
                this.isLogin = false;
                await this.getUser();
            }else{
                this.flag = false;
            }
        },
        async getUser(){
            let res = await this.$http.post('/oa/getUser',{loginId:this.loginId});
            if(res.state){
                this.user = res.data;
            }
        },
        async changeState(state){
            let res = await this.$http.post('/oa/updStatus',{loginId:this.loginId,enable:state});
            if(res.state){
                if(state){
                    this.$message.success('启用成功');
                }else{
                    this.$message.success('停用成功');
                }
                this.user.enable = state;
            }
        }
    }
};
</script>

<style scoped>
    .main{
        background: #ebebeb;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .btn{
        width: 80px;
        height: 80px;
        margin: 0 auto;
        line-height: 80px;
        margin-top: 5vh;
        background: #409eff;
        color: #fff;
        border-radius: 50%;
    }
    .login-box{
        border-radius: 20px;
        padding: 8vh 0;
        width: 90%;
        margin: 25vh auto;
    }
    .login-btn{
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        background: #409eff;
        color: #fff;
        border: 0;
        text-align: center;
        margin-top: 10vh;
    }
    .input{
        border: 0;
        border-bottom: 1px solid #dfdfdf;
        width: 100%;
    }
</style>
