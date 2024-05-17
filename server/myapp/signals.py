# myapp/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Thing
from django.db.models import F


@receiver(post_save, sender=Thing)
def update_recommend(sender, instance, **kwargs):
    # 只在不是通过原始查询（如数据库迁移）触发时更新recommend
    if not kwargs.get('raw', False):
        print('更新recommend')
        print(instance.wish_count * 0.3)
        print(instance.pv * 0.5)
        print(instance.collect_count * 0.2)
        print(instance.pk)
        collect_C = instance.collect_count * 0.2
        wish_C = instance.wish_count * 0.3
        pv_C = instance.pv * 0.5

        # # 计算recommend的值
        # instance.recommend = instance.wish_count + instance.collect_count
        # # 保存对象，只更新recommend字段
        # instance.save(update_fields=['recommend'])
        # 使用 F 表达式来避免加载对象到内存
        Thing.objects.filter(pk=instance.pk).update(recommend=collect_C + wish_C + pv_C)
