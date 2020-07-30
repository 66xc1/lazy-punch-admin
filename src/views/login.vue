<template>
    <login-bgd>
        <el-card style="margin: auto;width: 360px;">
            <div slot="header" class="clearfloat" style="text-align: center">
                <span>懒人考勤</span>
            </div>
            <el-form :model="loginInfo" ref='loginInfo' label-width="0"
                     @keyup.native.enter='handleLogin' style="margin-buttom: -40px;">
                <el-form-item prop='username'>
                    <el-input type="text" v-model="loginInfo.phone" auto-complete="off"
                              placeholder="请输入用户名" size="medium">
                        <i slot="prefix" class="el-input__icon el-icon-user"
                           style="font-size: 18px;"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop='password'>
                    <el-input :type="passwordType" v-model="loginInfo.pwd" auto-complete="off"
                              placeholder="6-16位密码" size="medium">
                        <i slot="prefix" class="el-input__icon el-icon-lock"
                           style="font-size: 18px;"></i>
                    </el-input>
                    <i class='el-icon-view showPwd' @click="showPwd"></i>
                </el-form-item>
                <el-form-item>
                    <el-button style='border-radius: 6px;' type="primary" class="w100" size="medium"
                               :loading="flag" @click="handleLogin">登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </login-bgd>
</template>

<script>
import LoginBgd from '@/components/LoginBgd';

class LoginInfo {
    constructor() {
        this.phone = 'admin';
        this.pwd = 'admin';
    }

    reset() {
        this.constructor();
    }
}

let fromUrl = null;

export default {
    components: {
        LoginBgd
    },
    data() {
        return {
            passwordType: 'password',
            loginInfo: new LoginInfo(),
            flag: false
        };
    },
    created() {
    },
    methods: {
        showPwd() {
            this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
        },
        async handleLogin() {
            if (this.flag) {
                return;
            }
            let res = await this.$http.post('/sys/login', this.loginInfo);
            if (res.state) {
                await this.$router.push('index');
            }
        },
    }
};
</script>

<style scoped lang="scss">
    .login-title {
        margin: 0 0 20px;
        text-align: center;
        color: #409eff;
        letter-spacing: 3px;
    }

    .showPwd {
        color: #909399;
        cursor: pointer;
        position: absolute;
        top: 13px;
        right: 10px;
    }

    .w100 {
        width: 100%;
    }

    .err-info {
        position: absolute;
        left: 50%;
        top: 200px;
        width: 600px;
        margin-left: -300px;
    }
</style>
