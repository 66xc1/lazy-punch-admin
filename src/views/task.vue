<template>
    <el-card>
        <el-button type="primary" @click="startAdd">新增</el-button>
        <el-button type="primary" @click="goUser">用户列表</el-button>
        <el-button plain class="mBottom16 fr" @click="getItemList">刷新</el-button>
        <el-table border size="small" :data="tableList" class="w100"  highlight-current-row>
            <el-table-column type="index" width="50" label='序号' align="center"></el-table-column>
            <el-table-column prop="beanName" label='bean名称' align="center" width="250"></el-table-column>
            <el-table-column prop="cron" label="cron表达式" align="center" width="250"></el-table-column>
            <el-table-column prop="remark" :show-overflow-tooltip="true" label="备注" align="center"></el-table-column>
            <el-table-column prop="status" label='状态' align="center" width="120">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status === 0 ? 'danger' : 'success'"
                        disable-transitions>{{scope.row.status===0?'停用':'启用'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-button type="info" size="small" @click="upd(scope.row)">修改</el-button>
                    <el-button type="success" size="small" v-show="!scope.row.status" @click="change(scope.row.jobKey,1)">恢复</el-button>
                    <el-button type="danger" size="small" v-show="scope.row.status" @click="change(scope.row.jobKey,0)">暂停</el-button>
                    <el-button type="primary" size="small" @click="run(scope.row.jobKey)">运行</el-button>
                    <el-button type="warning" size="small" @click="handleDel(scope.row.jobKey)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="40%">
            <el-form :model="item" label-width="100px">
                <el-row>
                    <el-col :sm="24">
                        <el-form-item label="bean名称">
                            <el-input v-model="item.beanName"></el-input>
                        </el-form-item>
                        <el-form-item label="表达式">
                            <el-input v-model="item.cron"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="item.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogConfirm">确定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
import QRCode from 'qrcodejs2';
class Item{
    constructor(){
        this.beanName = null;
        this.cron = null;
        this.remark = null;
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
        };
    },
    created() {
        this.getItemList();
    },
    methods: {
        goUser(){
            this.$router.push('index');
        },
        async getItemList(){
            let res = await this.$http.post('/quartz/getQuartzList',{});
            if(res.state){
                this.tableList = res.data;
            }
        },
        async dialogConfirm(){
            let url = '/quartz/addQuartz';
            if(this.title == '修改'){
                url = '/quartz/updQuartz';
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
            this.dialogVisible = true;
        },
        upd(row){
            this.item.reset();
            Object.assign(this.item,row);
            this.title = '修改';
            this.dialogVisible = true;
        },
        async change(jobKey,state){
            let url = '/quartz/pauseQuartz';
            if(state == 1){url = '/quartz/resumeQuartz';}
            let res = await this.$http.post(url,{jobKey});
            if(res.state){
                this.$message.success('操作成功');
                this.getItemList();
            }
        },
        async run(jobKey){
            let res = await this.$http.post('/quartz/runQuartz',{jobKey});
            if(res.state){
                this.$message.success('操作成功');
            }
        },
        async delRequest(jobKey){
            let res = await this.$http.post('/quartz/delQuartz',{jobKey});
            if(res.state){
                this.$message.success('操作成功');
                this.getItemList();
            }
        },
        handleDel(jobKey){
            this.$confirm('确认删除?', '提示', {}).then(() => {
                this.delRequest(jobKey);
            }).catch(() => {
            });
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
