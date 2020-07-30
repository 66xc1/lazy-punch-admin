<template>
    <div class="main">
        <div class="center" style="line-height: 50px;height: 50px;background: #fff;">懒人打卡</div>
        <div v-if="isLogin">
                <van-form label-width="80px" style="margin-top: 20vh" @submit="login">
                    <van-field
                        v-model="loginId"
                        name="loginId"
                        label="OA用户名"
                        placeholder="OA用户名"
                        :rules="[{ required: true, message: '请填写OA用户名' }]"
                    />
                    <div style="margin: 16px;">
                        <van-button round block type="info" native-type="submit">
                            登录
                        </van-button>
                    </div>
                </van-form>
        </div>
        <div class="center" style="margin-top: 20vh" v-else>
            <div v-show="0">{{sign}}</div>
            <p>OA账号：{{this.loginId}}</p><br>
            <p>打卡状态：{{user.enable|getName}}</p>
            <div class="btn" @click="changeState(1)" v-show="!user.enable">启用</div>
            <div class="btn" @click="changeState(0)" v-show="user.enable">停用</div>
        </div>
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
        async login(values){
            console.log('submit', values);
            this.flag = true;
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
        background: #fff;
        border: 1px solid #dfdfdf;
        border-radius: 50%;
    }
</style>
