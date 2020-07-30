function injectForEachMethod(method, targetType, clazz, targetName, sig, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstMethodCall(method,
        targetType,
        clazz,
        targetName,
        sig);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstMethodCallAfter(method,
            targetType,
            clazz,
            targetName,
            sig,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'tempt-via-trough': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.ai.goal.TemptGoal',
                'methodName': 'func_75250_a', // shouldExecute
                'methodDesc': '()Z'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachMethod(method,
                    ASM.MethodType.VIRTUAL,
                    "net/minecraft/world/World",
                    ASM.mapMethod("func_217370_a"), // getClosestPlayer
                    "(Lnet/minecraft/entity/EntityPredicate;Lnet/minecraft/entity/LivingEntity;)Lnet/minecraft/entity/player/PlayerEntity;",
                    function (target) {
                        var newInstructions = new InsnList();

                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "findTroughs",
                            "(Lnet/minecraft/entity/player/PlayerEntity;Lnet/minecraft/entity/ai/goal/TemptGoal;)Lnet/minecraft/entity/player/PlayerEntity;",
                            ASM.MethodType.STATIC
                        ));
                        method.instructions.insert(target, newInstructions);
                    });
            }
        }
    }
}
