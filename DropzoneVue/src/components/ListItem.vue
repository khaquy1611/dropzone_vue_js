<template>
    <div class="row">
        <div class="text">
            {{  filename }}
        </div>
        <div class="progress">
            <Progress :percentage="percentage" :state="uploadState" />
        </div>
    </div>
</template>

<script>
import Progress from './Progress.vue'
export default {
    name: 'WorkspaceJsonListItem',
    components: {
        Progress
    },
    props: {
        filename: {
            type: String,
            default: ''
        },
        uploadState: {
            type: String,
            default: 'ide'
        },
        percentage: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            
        };
    },

    mounted() {
    },

    methods: {
        
    },
};
</script>

<style  scoped>
.progress {
  float: left;
}
.text {
  float: right;
  flex: 1;
}
.row {
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>