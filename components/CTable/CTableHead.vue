<template>
    <div
        @click="onClick"
        :class="sortClass"
    >
        <slot />
        
        <template v-if="sorter">
            <Icon
                :name="`sort_${sortType}`"
                :size="5"
                class="ml-1 -translate-y-1/2"
            />
        </template>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import _ from 'lodash'

const props = defineProps({
    sorter: [ Boolean, Function ],
    dataIndex: String,
})

const types = [ 'normal', 'ascend', 'descend' ],
    index = ref(0),
    sortType = computed(() => types[index.value]),
    sortClass = computed(() => props.sorter ? 'c-table__sorter flex items-end' : '')

const sortParams = {
    normal: 0,
    ascend: - 1,
    descend: 1,
}

const onClick = () => {
    if (props.sorter) {
        index.value = (index.value + 1) % types.length
        
        if (_.isFunction(props.sorter)) props.sorter({
            type: sortType.value,
            dataIndex: props.dataIndex,
            value: sortParams[sortType.value],
        })
    }
}

defineOptions({ name: 'CTableHead' })
</script>

<style scoped>

</style>
