<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       class="home">
    <div class="header">
      <i class="el-icon-s-fold" @click="handleCollapse"></i>
      <div style="flex:1;padding-left: 10px">懒人考勤</div>
      <el-cascader v-if="!global.isAdmin" :props="global.orgTreeProps" :options="global.orgList"
                   :show-all-levels="false" v-model="global.orgId" @change="orgChange"
                   style="margin-right: 20px"></el-cascader>

      <div style="margin-left: 20px">
        <el-dropdown trigger="hover">
          <div class='userInfo'>
            <span style="color: #fff;" v-text="loginUser.name||loginUser.phone"></span>
            <!--<img :src="loginUser.headUrl">-->
          </div>
          <el-dropdown-menu slot="dropdown">
            <!--<el-dropdown-item @click.native='showUserFormDlg'>个人中心</el-dropdown-item>
            <el-dropdown-item @click.native='showRetrievePwdDlg'>修改密码</el-dropdown-item>-->
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="hkmain">
      <div class="leftBar" :class="{'collapseLeftBar':isCollapse}">
        <el-menu router :default-active="$route.path" :unique-opened='true' class="el-menu-vertical-demo"
                 background-color="#304156" text-color="#EBEEF5" active-text-color="#409EFF"
                 :collapse="isCollapse">
          <el-submenu :index="index+''" v-for='(item,index) of menuList' :key='index'><!--v-if="item.name!=='login'"-->
            <template slot="title">
              <i :class="item.memo"></i>
              <span slot="title" v-text="item.name"
                    style="display: inline-block;text-align: center;width: 60%;"></span>
            </template>
            <div v-for='(child) of item.children' :key='child.id'>
              <el-menu-item :index="child.url+'?viewPmId='+child.id"
                            v-if="child.name!=='角色详情'&&child.url!=='/'">
                                <span v-text="child.name"
                                      style="display: inline-block;text-align: left;width: 100%;"></span>
              </el-menu-item>

              <el-submenu v-if="child.url=='/'" :index="child.url+'?viewPmId='+child.id">
                <template slot="title" style="display: inline-block;text-align: center;width: 60%;">
                  {{child.name}}
                </template>
                <el-menu-item v-for='data of child.children' :key="data.id"
                              :index="data.url+'?viewPmId='+data.id">
                  {{data.name}}
                </el-menu-item>
              </el-submenu>
            </div>
            <!--<el-menu-item-group v-for='(child) of item.children' :key='child.id' v-if="child.name!=='角色详情'&&child.url!=='/'">-->
            <!--<el-menu-item v-text='child.name' :index="child.url"></el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--<el-submenu v-for='child of item.children' :index="child.url" :key='child.id' v-if="child.url=='/'">-->
            <!--<template slot="title">{{child.name}}</template>-->
            <!--<el-menu-item v-for='data of child.children' :key="data.id" :index="data.url">{{data.name}}</el-menu-item>-->
            <!--</el-submenu>-->
          </el-submenu>
        </el-menu>
      </div>
      <div class="rightBar">
        <div class="hk-tagsView">
          <tags-view></tags-view>
        </div>
        <div class="mainContent">
          <transition name="fade-transform" mode="out-in">
            <!--<keep-alive>-->
              <!--<router-view :key="menuItemKey"/>-->
            <!--</keep-alive>-->
              <keep-alive :include="cachedViews">
                  <router-view :key="menuItemKey"/>
              </keep-alive>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TagsView from '@/components/TagsView';

class User {
    constructor() {
        this.id = null;
        this.name = null;
        this.headUrl = '/static/img/20180419163649.41ae0fa5.jpg';
    }

}

export default {
    name: 'home',
    components: {
        TagsView,
    },
    data() {
        return {
            loginUser: new User(),
            isCollapse: false,
            // menuList: this.$router.options.routes
            menuList: [],
        };
    },
    computed: {
        loading() {
            return Boolean(this.$store.state.loading.loading);
        },
        menuItemKey() {
            return this.$route.fullPath;
        },
        cachedViews() {
            return this.$store.state.tagsView.cachedViews;
        }
    },
    methods: {
        handleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        async logoutRequest() {
            let res = await this.$http.post('/auth/logout', {});
            if (res.state) {
                this.$store.dispatch('delAllViews');
                sessionStorage.clear();
                this.isLoginOut = true;
                this.$router.push('/login');
            }
        },
        logout() {
            this.$confirm('确认退出吗?', '提示', {}).then(() => {
                this.logoutRequest();
            }).catch(() => {
            });
        },
        async getUserById() {       												//获取用户信息
            let userId = sessionStorage.getItem('userId') || null;
            if (!userId) {
                this.$router.push('/login');
                return;
            }
            let res = await this.$http.post('sys/getUser', {userId});
            if (res.state) {
                this.loginUser.id = res.data.id;
                this.loginUser.name = res.data.name;
                window.IMAGE_BASE = res.data.imageUrl;
                if (res.data.isAdmin == 1) {
                    this.global.isAdmin = true;
                    sessionStorage.setItem('isAdmin', true);
                } else {
                    this.global.isAdmin = false;
                    sessionStorage.setItem('isAdmin', false);
                }
                if (res.data.headUrl) {
                    this.loginUser.headUrl = res.data.headUrl;
                }
                sessionStorage.setItem('userMsg', JSON.stringify(res.data));

                if (!this.global.orgId.length) {
                    if (res.data.orgList && res.data.orgList.length) {
                        this.global.orgId.push(res.data.orgList[0].id);
                    }
                    localStorage.setItem('orgId', JSON.stringify(this.global.orgId));
                }

                this.getUserView();
                if(res.data.orgList){
                    this.global.orgList = res.data.orgList;
                    sessionStorage.setItem('orgList',JSON.stringify(this.global.orgList));
                }
                this.getOrgTreeByCurrentOrgId();
            }
        },
        orgChange(val) {
            if (val) {
                localStorage.setItem('orgId', JSON.stringify(val));
                this.$store.dispatch('delAllViews');
                this.$router.push('/');
                if (!this.global.isAdmin) {
                    this.getUserView();
                    this.getOrgTreeByCurrentOrgId();
                }
            }
        },
        async getUserView() {
            let orgId = this.global.orgId[this.global.orgId.length - 1];
            let param = {
                orgId: orgId,
                userId: sessionStorage.getItem('userId')
            };
            let res = await this.$http.post('/sys/userViewPermission', param);
            if (res.state) {
                this.menuList = res.data;
            }
        },
        async getOrgTreeByCurrentOrgId() {
            this.global.searchOrgId = null;
            this.global.permitOrgList = [];
            let res = await this.$http.post('/sys/getOrgTree', {
                orgId: this.global.orgId[this.global.orgId.length - 1],
                containSelf: true
            });
            if (res.state) {
                this.global.permitOrgList = res.data;
                let val = this.deepClone(this.global.orgId);
                this.global.searchOrgId = [val.pop()];
            }
        },
        async getDictionary() {
            let res = await this.$http.post('/sys/getDictionaryList', {});
            if (res.state) {
                if (res.data) {
                    this.global.DictionaryData = res.data;
                    sessionStorage.setItem('DictionaryData', JSON.stringify(res.data));
                }
            }
        }
    },
    mounted() {
        this.getUserById();
        this.getDictionary();
    }
};
</script>
<style lang="scss" scoped>
  .home {
    height: calc(100vh);
    background: #efefef;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background: #242f42;
    padding: 0 15px;
    font-size: 18px;
    color: #fff;
    i {
      font-size: 25px;
      color: #fff;
      cursor: pointer;
    }
  }

  .userInfo {
    display: flex;
    align-items: center;
    padding-right: 30px;
    font-size: 18px;
    cursor: pointer;
    img {
      width: 36px;
      border-radius: 50%;
      margin-left: 10px;
    }
  }

  .hkmain {
    height: calc(100vh - 60px);
    display: flex;
    .leftBar {
      flex: 0 0 160px;
      height: 100%;
      background: #304156;
      width: 160px;
      transition: all .2s linear;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .rightBar {
      flex: 1;
      height: 100%;
      transition: all .2s linear;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .el-menu {
    border: none;
  }

  .collapseLeftBar {
    flex: 0 0 64px !important;
    width: 64px !important;
  }

  .hk-tagsView {
    height: 35px;
    background: #fff;
  }

  .mainContent {
    padding: 10px;
    box-sizing: border-box;
  }

  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-track {
    background-color: #bee1eb;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #00aff0;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #9c3
  }

  ::-webkit-scrollbar-thumb:active {
    background-color: #00aff0
  }
</style>
<style>
  .el-submenu__title i {
    color: #EBEEF5 !important;
  }

  .el-menu-item,
  .el-menu--popup {
    text-align: center !important;
    min-width: 160px !important;
  }

  .el-menu-item-group__title {
    padding: 0;
  }

  .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
</style>
