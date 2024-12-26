<template>
    <span :class="[ color ]">
        {{ plus }}{{ content }}{{ suffix }}
    </span>
</template>

<script setup>
import { computed } from 'vue'
import { utils_colorful } from '../../utils'

const props = defineProps({
    amount: {
        type: [ String, Number ],
        required: true,
        validator(value) {
            if (isNaN(+ value)) {
                throw Error('金额必须是数字')
            }
            return true
        },
    },
    fixed: {
        type: Number,
        default: 2,
    },
    colorful: {
        type: Boolean,
        default: true,
    },
    symbol: Boolean,
    suffix: String,
})

const content = computed(() => Number(props.amount).toFixed(props.fixed)),
    color = computed(() => props.colorful ? utils_colorful(content.value, '') : ''),
    plus = computed(() => props.symbol && content.value > 0 ? '+' : undefined)

defineOptions({ name: 'Amount' })
</script>

<style scoped>

</style>
