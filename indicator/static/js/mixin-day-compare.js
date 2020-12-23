var mixin_day_compare = {
    data: {
    },
    methods: {
        cmp_date_str(daterange) {
            var data = {
                day: moment().subtract(1, 'day').format("YYYY-MM-DD"),
                day_prev_7d: moment().subtract(8, 'day').format("YYYY-MM-DD"),
                day_prev_7d_text: moment().subtract(1, 'day').locale('zh-tw').format("dd"),
                this_w1: moment().startOf('isoweek').format("YYYY-MM-DD"),
                this_w2: moment().endOf('isoweek').format("YYYY-MM-DD"),
                prev_w1: moment().startOf('isoweek').subtract(7, 'day').format("YYYY-MM-DD"),
                prev_w2: moment().endOf('isoweek').subtract(7, 'day').format("YYYY-MM-DD"),
                prev_2w1: moment().startOf('isoweek').subtract(14, 'day').format("YYYY-MM-DD"),
                prev_2w2: moment().endOf('isoweek').subtract(14, 'day').format("YYYY-MM-DD"),
                this_m1: moment().startOf('month').format("YYYY-MM-DD"),
                this_m2: moment().endOf('month').format("YYYY-MM-DD"),
                prev_m1: moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD"),
                prev_m2: moment().subtract(1, 'month').endOf('month').format("YYYY-MM-DD"),
                prev_2m1: moment().subtract(2, 'month').startOf('month').format("YYYY-MM-DD"),
                prev_2m2: moment().subtract(2, 'month').endOf('month').format("YYYY-MM-DD"),
            }
            switch (daterange) {
                case "昨天":
                    return ['昨天',`與上週${data.day_prev_7d_text}`,[`(${data.day})`,`(${data.day_prev_7d})`]]
                case "本週":
                    return ['本週','與上週',[`(${data.this_w1}~${data.this_w2})`,`(${data.prev_w1}~${data.prev_w2})`]]
                case "上週":
                    return ['上週','與上上週',[`(${data.prev_w1}~${data.prev_w2})`,`(${data.prev_2w1}~${data.prev_2w2})`]]
                case "本月":
                    return ['本月','與上月',[`(${data.this_m1}~${data.this_m2})`,`(${data.prev_m1}~${data.prev_m2})`]]
                case "上月":
                    return ['上月','與上上月',[`(${data.prev_m1}~${data.prev_m2})`,`(${data.prev_2m1}~${data.prev_2m2})`]]
            }
        },
    }
}